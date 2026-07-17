import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import L from 'leaflet'
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'
import {
  Activity,
  Clock3,
  Gauge,
  Layers3,
  LocateFixed,
  MapPin,
  Navigation,
  Radio,
  RefreshCw,
  Route,
  Satellite,
  Search,
  Truck,
  Wifi,
  WifiOff,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { locationApi, tripApi, vehicleApi } from '../api/services'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'

const INDIA_CENTER = { latitude: 20.5937, longitude: 78.9629 }

const pickupIcon = L.divIcon({
  className: '',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  html: `
    <div style="display:grid;place-items:center;width:38px;height:38px;border-radius:20px 20px 20px 4px;transform:rotate(-45deg);background:#123c31;border:3px solid white;box-shadow:0 10px 24px rgba(15,23,42,.25)">
      <span style="transform:rotate(45deg);color:#c8f55a;font:900 12px Inter,sans-serif">A</span>
    </div>
  `,
})

const destinationIcon = L.divIcon({
  className: '',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  html: `
    <div style="display:grid;place-items:center;width:38px;height:38px;border-radius:20px 20px 20px 4px;transform:rotate(-45deg);background:#c65f3d;border:3px solid white;box-shadow:0 10px 24px rgba(15,23,42,.25)">
      <span style="transform:rotate(45deg);color:white;font:900 12px Inter,sans-serif">B</span>
    </div>
  `,
})

const formatTime = (value) => {
  if (!value) return 'No signal yet'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'No signal yet' : date.toLocaleTimeString()
}

const formatDateTime = (value) => {
  if (!value) return 'No signal yet'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'No signal yet' : date.toLocaleString()
}

const toNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const distanceBetween = (a, b) => {
  if (!a || !b) return Number.POSITIVE_INFINITY
  const lat = toNumber(a[0]) - toNumber(b[0])
  const lng = toNumber(a[1]) - toNumber(b[1])
  return lat * lat + lng * lng
}

const createVehicleIcon = (point, isSelected) =>
  L.divIcon({
    className: '',
    iconSize: [54, 54],
    iconAnchor: [27, 27],
    html: `
      <div style="
        position:relative;
        display:grid;
        place-items:center;
        width:54px;
        height:54px;
        border-radius:999px;
        background:${isSelected ? '#c8f55a' : '#123c31'};
        color:${isSelected ? '#13231d' : '#c8f55a'};
        border:4px solid white;
        box-shadow:0 16px 36px rgba(15,23,42,.24), 0 0 0 ${isSelected ? '12px' : '7px'} rgba(200,245,90,.28);
        font:800 11px Inter, sans-serif;
      ">
        ${Math.round(toNumber(point.speed))}
        <span style="
          position:absolute;
          right:-4px;
          bottom:-4px;
          width:16px;
          height:16px;
          border-radius:999px;
          border:3px solid white;
          background:#22c55e;
        "></span>
      </div>
    `,
  })

function Recenter({ point, zoom = 13 }) {
  const map = useMap()

  useEffect(() => {
    if (point?.latitude && point?.longitude) {
      map.panTo([point.latitude, point.longitude], { animate: true, duration: 0.6 })
    }
  }, [map, point, zoom])

  return null
}

function MapBounds({ points }) {
  const map = useMap()

  useEffect(() => {
    if (points.length < 2) return
    const bounds = L.latLngBounds(points.map((point) => [point.latitude, point.longitude]))
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13 })
  }, [map, points])

  return null
}

function RouteBounds({ routePoints }) {
  const map = useMap()
  const fittedRouteRef = useRef('')

  useEffect(() => {
    if (!routePoints.length) return
    const routeKey = `${routePoints[0]?.join(',')}|${routePoints[routePoints.length - 1]?.join(',')}|${routePoints.length}`
    if (fittedRouteRef.current === routeKey) return
    fittedRouteRef.current = routeKey

    const bounds = L.latLngBounds(routePoints)
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 13 })
  }, [map, routePoints])

  return null
}

export default function TrackingPage() {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(true)
  const [locations, setLocations] = useState({})
  const [history, setHistory] = useState([])
  const [tripRoute, setTripRoute] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [activeTrips, setActiveTrips] = useState([])
  const [selectedVehicleId, setSelectedVehicleId] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [lastSignalAt, setLastSignalAt] = useState(null)
  const socketRef = useRef(null)

  const points = useMemo(
    () =>
      Object.values(locations)
        .filter((point) => point?.vehicleId && point?.latitude && point?.longitude)
        .sort((a, b) => String(a.vehicleId).localeCompare(String(b.vehicleId))),
    [locations],
  )

  const selected = useMemo(() => {
    if (!selectedVehicleId) return points[0] || null
    return locations[selectedVehicleId] || points.find((point) => point.vehicleId === selectedVehicleId) || null
  }, [locations, points, selectedVehicleId])

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => String(vehicle.vehicleId) === String(selected?.vehicleId)),
    [selected, vehicles],
  )

  const activeTripByVehicleNumber = useMemo(() => {
    const map = new Map()
    activeTrips
      .filter((trip) => ['SCHEDULED', 'IN_PROGRESS'].includes(trip.tripStatus))
      .forEach((trip) => {
      if (trip.vehicleNumber) map.set(String(trip.vehicleNumber).toLowerCase(), trip)
    })
    return map
  }, [activeTrips])

  const trackedPoints = useMemo(
    () =>
      points.filter((point) => {
        const vehicle = vehicles.find((item) => String(item.vehicleId) === String(point.vehicleId))
        return activeTripByVehicleNumber.has(String(vehicle?.vehicleNumber || '').toLowerCase())
      }),
    [activeTripByVehicleNumber, points, vehicles],
  )

  const selectedTrip = selectedVehicle?.vehicleNumber
    ? activeTripByVehicleNumber.get(String(selectedVehicle.vehicleNumber).toLowerCase())
    : null

  const filteredPoints = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return trackedPoints
    return trackedPoints.filter((point) => {
      const vehicle = vehicles.find((item) => String(item.vehicleId) === String(point.vehicleId))
      return [
        point.vehicleId,
        vehicle?.vehicleNumber,
        vehicle?.vehicleType,
        activeTripByVehicleNumber.get(String(vehicle?.vehicleNumber || '').toLowerCase())?.drivername,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    })
  }, [activeTripByVehicleNumber, search, trackedPoints, vehicles])

  const trail = useMemo(
    () =>
      history
        .filter((point) => point?.latitude && point?.longitude)
        .map((point) => [point.latitude, point.longitude]),
    [history],
  )

  const routePoints = useMemo(
    () =>
      (tripRoute?.coordinates || [])
        .filter((point) => point?.latitude && point?.longitude)
        .map((point) => [point.latitude, point.longitude]),
    [tripRoute],
  )

  const pickupPoint = routePoints[0]
  const destinationPoint = routePoints[routePoints.length - 1]

  const routeProgress = useMemo(() => {
    if (!selected?.latitude || !selected?.longitude || routePoints.length < 2) {
      return { completed: [], remaining: routePoints, percent: 0 }
    }

    const vehiclePoint = [selected.latitude, selected.longitude]
    let nearestIndex = 0
    let nearestDistance = Number.POSITIVE_INFINITY

    routePoints.forEach((point, index) => {
      const distance = distanceBetween(point, vehiclePoint)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })

    const completed = [...routePoints.slice(0, nearestIndex + 1), vehiclePoint]
    const remaining = [vehiclePoint, ...routePoints.slice(nearestIndex + 1)]
    const percent = Math.round((nearestIndex / (routePoints.length - 1)) * 100)

    return { completed, remaining, percent }
  }, [routePoints, selected?.latitude, selected?.longitude])

  const center = selectedTrip ? selected : trackedPoints[0] || INDIA_CENTER
  const movingVehicles = trackedPoints.filter((point) => toNumber(point.speed) > 0).length
  const averageSpeed = trackedPoints.length
    ? Math.round(trackedPoints.reduce((sum, point) => sum + toNumber(point.speed), 0) / trackedPoints.length)
    : 0

  const loadTrackingData = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true)
    try {
      const [tripsResponse, vehiclesResponse] = await Promise.all([
        tripApi.active().catch(() => ({ data: [] })),
        vehicleApi.all().catch(() => ({ data: [] })),
      ])

      const loadedTrips = Array.isArray(tripsResponse.data) ? tripsResponse.data : []
      const loadedVehicles = Array.isArray(vehiclesResponse.data) ? vehiclesResponse.data : []
      setActiveTrips(loadedTrips)
      setVehicles(loadedVehicles)

      const latestResponses = await Promise.allSettled(
        loadedVehicles.map((vehicle) => locationApi.latest(vehicle.vehicleId)),
      )

      const latestLocations = {}
      latestResponses.forEach((result) => {
        if (result.status === 'fulfilled' && result.value?.data?.vehicleId) {
          latestLocations[result.value.data.vehicleId] = result.value.data
        }
      })

      setLocations((current) => {
        const activeVehicleNumbers = new Set(
          loadedTrips
            .filter((trip) => ['SCHEDULED', 'IN_PROGRESS'].includes(trip.tripStatus))
            .map((trip) => String(trip.vehicleNumber || '').toLowerCase()),
        )
        const next = { ...latestLocations, ...current }
        Object.keys(next).forEach((vehicleId) => {
          const vehicle = loadedVehicles.find((item) => String(item.vehicleId) === String(vehicleId))
          if (!activeVehicleNumbers.has(String(vehicle?.vehicleNumber || '').toLowerCase())) delete next[vehicleId]
        })
        return next
      })
    } catch (error) {
      toast.error('Unable to load live tracking data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTrackingData()

    const refreshTimer = window.setInterval(() => loadTrackingData({ quiet: true }), 10000)

    const client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {},
      onConnect: () => {
        setConnected(true)
        setConnecting(false)
        client.subscribe('/topic/location', ({ body }) => {
          try {
            const ping = JSON.parse(body)
            if (!ping?.vehicleId) return
            setLocations((current) => ({ ...current, [ping.vehicleId]: ping }))
            setLastSignalAt(new Date().toISOString())
            setSelectedVehicleId((current) => current || ping.vehicleId)
          } catch {
            toast.error('Received an invalid location update')
          }
        })
      },
      onWebSocketClose: () => {
        setConnected(false)
        setConnecting(true)
      },
      onStompError: () => {
        setConnected(false)
        setConnecting(true)
        toast.error('Live tracking connection interrupted')
      },
    })

    socketRef.current = client
    client.activate()

    return () => {
      window.clearInterval(refreshTimer)
      socketRef.current = null
      client.deactivate()
    }
  }, [loadTrackingData])

  useEffect(() => {
    if (selectedVehicleId && !trackedPoints.some((point) => String(point.vehicleId) === String(selectedVehicleId))) {
      setSelectedVehicleId(trackedPoints[0]?.vehicleId || null)
      setTripRoute(null)
    }
  }, [selectedVehicleId, trackedPoints])

  useEffect(() => {
    if (!selected?.vehicleId) {
      setHistory([])
      return
    }

    let ignore = false
    setLoadingHistory(true)
    locationApi
      .history(selected.vehicleId)
      .then(({ data }) => {
        if (!ignore) setHistory(Array.isArray(data) ? data.slice(-80) : [])
      })
      .catch(() => {
        if (!ignore) setHistory([])
      })
      .finally(() => {
        if (!ignore) setLoadingHistory(false)
      })

    return () => {
      ignore = true
    }
  }, [selected?.vehicleId])

  useEffect(() => {
    if (!selectedTrip?.tripId || !['SCHEDULED', 'IN_PROGRESS'].includes(selectedTrip.tripStatus)) {
      setTripRoute(null)
      return
    }

    let ignore = false
    tripApi
      .route(selectedTrip.tripId)
      .then(({ data }) => {
        if (!ignore) setTripRoute(data)
      })
      .catch(() => {
        if (!ignore) setTripRoute(null)
      })

    return () => {
      ignore = true
    }
  }, [selectedTrip?.tripId, selectedTrip?.tripStatus])

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] border bg-ink p-6 text-white shadow-soft dark:border-white/10">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-lime/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-clay/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-lime">
                <Satellite size={14} />
                Live tracking
              </span>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                  connected ? 'bg-emerald-400/15 text-emerald-200' : 'bg-amber-400/15 text-amber-100'
                }`}
              >
                {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
                {connected ? 'WebSocket connected' : connecting ? 'Connecting socket' : 'Offline'}
              </span>
            </div>
            <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Fleet command map
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Real-time vehicle pings from <span className="font-semibold text-white">/topic/location</span>,
              latest backend coordinates, active trips, speed, and historical route trails on OpenStreetMap.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadTrackingData()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-lime px-4 py-3 text-sm font-extrabold text-ink transition hover:-translate-y-0.5"
          >
            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
            Refresh fleet
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Radio} label="Reporting vehicles" value={trackedPoints.length} tone="lime" />
        <MetricCard icon={Navigation} label="Moving now" value={movingVehicles} tone="emerald" />
        <MetricCard icon={Route} label="Active trips" value={activeTrips.length} tone="clay" />
        <MetricCard icon={Gauge} label="Avg speed" value={`${averageSpeed} km/h`} tone="blue" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <aside className="card order-2 overflow-hidden p-0 xl:order-1">
          <div className="border-b bg-white p-5 dark:bg-[#131e1a]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-extrabold">Vehicles in motion</h3>
                <p className="mt-1 text-sm text-stone-500">Select a vehicle to follow its live location.</p>
              </div>
              <span className="rounded-full bg-lime/20 px-3 py-1 text-xs font-extrabold text-pine dark:text-lime">
                {filteredPoints.length}
              </span>
            </div>

            <label className="mt-4 flex items-center gap-2 rounded-2xl border bg-stone-50 px-3 py-2.5 text-sm dark:bg-white/5">
              <Search size={16} className="text-stone-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search vehicle, driver, type..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
              />
            </label>
          </div>

          <div className="max-h-[575px] overflow-y-auto">
            {loading ? (
              <div className="space-y-3 p-5">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-24 animate-pulse rounded-2xl bg-stone-100 dark:bg-white/5" />
                ))}
              </div>
            ) : filteredPoints.length ? (
              <div className="divide-y dark:divide-white/10">
                {filteredPoints.map((point) => {
                  const vehicle = vehicles.find((item) => String(item.vehicleId) === String(point.vehicleId))
                  const trip = activeTripByVehicleNumber.get(String(vehicle?.vehicleNumber || '').toLowerCase())
                  const isSelected = String(selected?.vehicleId) === String(point.vehicleId)

                  return (
                    <button
                      key={point.vehicleId}
                      type="button"
                      onClick={() => setSelectedVehicleId(point.vehicleId)}
                      className={`w-full p-4 text-left transition hover:bg-stone-50 dark:hover:bg-white/5 ${
                        isSelected ? 'bg-lime/15' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-pine text-lime shadow-soft">
                          <Truck size={21} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate font-display text-base font-extrabold">
                              {vehicle?.vehicleNumber || `Vehicle #${point.vehicleId}`}
                            </p>
                            <span className="rounded-full bg-white px-2 py-1 text-xs font-extrabold text-ink shadow-sm dark:bg-white/10 dark:text-white">
                              {Math.round(toNumber(point.speed))} km/h
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-stone-500">
                            {vehicle?.vehicleType || 'Fleet unit'} · ID {point.vehicleId}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {trip ? <StatusBadge status={trip.tripStatus} /> : <StatusBadge status="TRACKING" />}
                            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-1 text-[11px] font-bold text-stone-500 dark:bg-white/10 dark:text-stone-300">
                              <Clock3 size={12} />
                              {formatTime(point.timestamp)}
                            </span>
                          </div>
                          {trip && (
                            <p className="mt-3 line-clamp-1 text-xs font-medium text-stone-500">
                              {trip.pickupLocation} → {trip.destinationLocation}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <EmptyState
                icon={Radio}
                title="Waiting for location pings"
                description="Start a trip to see active vehicle movement here."
              />
            )}
          </div>
        </aside>

        <section className="order-1 overflow-hidden rounded-[1.6rem] border bg-white shadow-soft dark:bg-[#131e1a] xl:order-2">
          <div className="flex flex-col justify-between gap-3 border-b p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">OpenStreetMap</p>
              <h3 className="mt-1 font-display text-xl font-extrabold">
                {selectedVehicle?.vehicleNumber || (selected ? `Vehicle #${selected.vehicleId}` : 'Fleet map')}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded-full bg-stone-100 px-3 py-1.5 text-stone-500 dark:bg-white/10 dark:text-stone-300">
                Trip route: {routePoints.length ? `${routeProgress.percent}% completed` : 'not loaded'}
              </span>
              <span className="rounded-full bg-stone-100 px-3 py-1.5 text-stone-500 dark:bg-white/10 dark:text-stone-300">
                Last signal: {formatTime(lastSignalAt || selected?.timestamp)}
              </span>
            </div>
          </div>

          <div className="relative h-[560px] xl:h-[680px]">
            <MapContainer
              center={[center.latitude, center.longitude]}
              zoom={trackedPoints.length ? 12 : 5}
              scrollWheelZoom
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {trackedPoints.length > 1 && !selected && <MapBounds points={trackedPoints} />}
              {selected && !routePoints.length && <Recenter point={selected} />}
              {routePoints.length > 1 && <RouteBounds routePoints={routePoints} />}

              {routePoints.length > 1 && (
                <Polyline
                  positions={routePoints}
                  pathOptions={{ color: '#c65f3d', weight: 6, opacity: 0.28, lineCap: 'round', dashArray: '10 10' }}
                />
              )}

              {routeProgress.remaining.length > 1 && (
                <Polyline
                  positions={routeProgress.remaining}
                  pathOptions={{ color: '#c65f3d', weight: 6, opacity: 0.85, lineCap: 'round', dashArray: '10 10' }}
                />
              )}

              {routeProgress.completed.length > 1 && (
                <Polyline
                  positions={routeProgress.completed}
                  pathOptions={{ color: '#123c31', weight: 8, opacity: 0.95, lineCap: 'round' }}
                />
              )}

              {pickupPoint && (
                <Marker position={pickupPoint} icon={pickupIcon}>
                  <Popup>
                    <strong>Pickup</strong>
                    <br />
                    {selectedTrip?.pickupLocation}
                  </Popup>
                </Marker>
              )}

              {destinationPoint && (
                <Marker position={destinationPoint} icon={destinationIcon}>
                  <Popup>
                    <strong>Destination</strong>
                    <br />
                    {selectedTrip?.destinationLocation}
                  </Popup>
                </Marker>
              )}

              {trail.length > 1 && (
                <Polyline
                  positions={trail}
                  pathOptions={{ color: '#123c31', weight: 5, opacity: 0.65, lineCap: 'round' }}
                />
              )}

              {history.slice(-12).map((point) => (
                <CircleMarker
                  key={`${point.id || point.timestamp}-${point.latitude}-${point.longitude}`}
                  center={[point.latitude, point.longitude]}
                  radius={4}
                  pathOptions={{ color: '#c8f55a', fillColor: '#123c31', fillOpacity: 0.75, weight: 1 }}
                />
              ))}

              {trackedPoints.map((point) => {
                const isSelected = String(selected?.vehicleId) === String(point.vehicleId)
                const vehicle = vehicles.find((item) => String(item.vehicleId) === String(point.vehicleId))

                return (
                  <Marker
                    key={point.vehicleId}
                    position={[point.latitude, point.longitude]}
                    icon={createVehicleIcon(point, isSelected)}
                    eventHandlers={{ click: () => setSelectedVehicleId(point.vehicleId) }}
                  >
                    <Popup>
                      <div className="min-w-44">
                        <strong>{vehicle?.vehicleNumber || `Vehicle #${point.vehicleId}`}</strong>
                        <br />
                        Speed: {Math.round(toNumber(point.speed))} km/h
                        <br />
                        Last signal: {formatTime(point.timestamp)}
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>

            {!trackedPoints.length && (
              <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-2xl border bg-white/90 p-4 text-sm shadow-soft backdrop-blur dark:bg-[#131e1a]/90">
                <div className="flex items-center gap-3">
                  <Radio className="animate-pulse text-clay" />
                  <div>
                    <p className="font-bold">No active trips on the map</p>
                    <p className="text-stone-500">
                      Deleted or cancelled trips are hidden automatically. Start a trip to show its route and vehicle.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {routePoints.length > 1 && (
              <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border bg-white/90 p-3 text-xs font-bold shadow-soft backdrop-blur dark:bg-[#131e1a]/90">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-8 rounded-full bg-pine dark:bg-lime" />
                  Completed
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-1.5 w-8 rounded-full bg-clay" />
                  Remaining
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {selected && (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">Selected vehicle</p>
                <h3 className="mt-2 font-display text-2xl font-extrabold">
                  {selectedVehicle?.vehicleNumber || `Vehicle #${selected.vehicleId}`}
                </h3>
                <p className="mt-2 text-sm text-stone-500">
                  {selectedVehicle?.vehicleType || 'Vehicle'} · {selectedVehicle?.vehicleStatus || 'tracking'}
                </p>
              </div>
              <StatusBadge status={selectedTrip?.tripStatus || 'LIVE'} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <InfoTile icon={Gauge} label="Current speed" value={`${toNumber(selected.speed).toFixed(1)} km/h`} />
              <InfoTile
                icon={LocateFixed}
                label="Coordinates"
                value={`${toNumber(selected.latitude).toFixed(5)}, ${toNumber(selected.longitude).toFixed(5)}`}
              />
              <InfoTile icon={Activity} label="Last signal" value={formatDateTime(selected.timestamp)} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">Trip context</p>
                <h3 className="mt-2 font-display text-xl font-extrabold">Active assignment</h3>
              </div>
              {loadingHistory && <RefreshCw size={18} className="animate-spin text-stone-400" />}
            </div>

            {selectedTrip ? (
              <div className="mt-5 space-y-4 text-sm">
                <RouteLine icon={Truck} label="Driver" value={selectedTrip.drivername || 'Driver assigned'} />
                <RouteLine icon={MapPin} label="Pickup" value={selectedTrip.pickupLocation} />
                <RouteLine icon={Navigation} label="Destination" value={selectedTrip.destinationLocation} />
                <RouteLine
                  icon={Clock3}
                  label="Schedule"
                  value={`${selectedTrip.tripDate || 'Date pending'} · ${selectedTrip.tripTime || 'Time pending'}`}
                />
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed p-5 text-sm text-stone-500 dark:border-white/10">
                This vehicle is not attached to a scheduled or in-progress trip anymore.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, tone }) {
  const tones = {
    lime: 'bg-lime/20 text-pine dark:text-lime',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300',
    clay: 'bg-orange-100 text-clay dark:bg-orange-400/10 dark:text-orange-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300',
  }

  return (
    <div className="card flex items-center gap-4">
      <div className={`grid h-12 w-12 place-items-center rounded-2xl ${tones[tone] || tones.lime}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">{label}</p>
        <p className="mt-1 font-display text-2xl font-extrabold">{value}</p>
      </div>
    </div>
  )
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border bg-stone-50 p-4 dark:bg-white/5">
      <Icon size={18} className="text-clay" />
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-stone-400">{label}</p>
      <p className="mt-1 break-words font-display text-base font-extrabold">{value}</p>
    </div>
  )
}

function RouteLine({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-stone-100 text-pine dark:bg-white/10 dark:text-lime">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">{label}</p>
        <p className="mt-1 font-semibold">{value || 'Not available'}</p>
      </div>
    </div>
  )
}
