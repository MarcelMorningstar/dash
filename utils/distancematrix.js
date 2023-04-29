import { GOOGLE_API_KEY } from '@env'

export const travelInfo = async (origin, destination) => {
  const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&units=metric&key=${GOOGLE_API_KEY}`)
  .then(response => response.json())
  .then(data => {
    return data
  })

  return response.rows[0].elements[0]
}