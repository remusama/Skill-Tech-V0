"use client"

import React, { useState, useEffect } from "react"

// Define la estructura de un dispositivo de audio que recibimos de la API
interface AudioDevice {
  id: number
  name: string
}

const API_BASE_URL = "http://localhost:8000" // Asegúrate de que coincida con tu backend

const AudioDeviceSelector: React.FC = () => {
  const [devices, setDevices] = useState<AudioDevice[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState("")

  // 1. Cargar la lista de dispositivos cuando el componente se monta
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/audio/devices`)
        if (!response.ok) {
          throw new Error("No se pudo obtener la lista de dispositivos.")
        }
        const data = await response.json()
        setDevices(data.devices || [])
      } catch (error) {
        console.error("Error al cargar dispositivos:", error)
        setStatusMessage("Error al cargar dispositivos.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDevices()
  }, [])

  // 2. Manejar el cambio de selección del dispositivo
  const handleDeviceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = parseInt(event.target.value, 10)
    setSelectedDeviceId(deviceId)
    setStatusMessage("Actualizando dispositivo...")

    try {
      const response = await fetch(`${API_BASE_URL}/api/audio/device`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: deviceId }),
      })

      if (!response.ok) {
        throw new Error("Fallo al actualizar el dispositivo.")
      }
      setStatusMessage("Dispositivo de audio para lip-sync actualizado.")
    } catch (error) {
      console.error("Error al actualizar dispositivo:", error)
      setStatusMessage("Error al actualizar.")
    }
  }

  return (
    <div style={{ fontFamily: "sans-serif", margin: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <label htmlFor="audio-device-selector" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
        Salida de Audio (para Lip-Sync)
      </label>
      <select
        id="audio-device-selector"
        value={selectedDeviceId}
        onChange={handleDeviceChange}
        disabled={isLoading || devices.length === 0}
        style={{ width: "100%", padding: "0.5rem", borderRadius: "4px" }}
      >
        <option value="" disabled>
          {isLoading ? "Cargando dispositivos..." : "Selecciona un dispositivo"}
        </option>
        {devices.map((device) => (
          <option key={device.id} value={device.id}>
            {device.name}
          </option>
        ))}
      </select>
      {statusMessage && <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#555" }}>{statusMessage}</p>}
    </div>
  )
}

export default AudioDeviceSelector