export function readImageFile(event, onLoad) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => onLoad(String(reader.result))
  reader.readAsDataURL(file)
}
