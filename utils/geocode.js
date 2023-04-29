import { GOOGLE_API_KEY } from '@env'

export const getFormattedAddress = async (location) => {
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${GOOGLE_API_KEY}`)
  .then(response => response.json())
  .then(data => {
    return data
  })

  return response.results[0].formatted_address
}