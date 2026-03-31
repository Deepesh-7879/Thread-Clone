export async function uploadImage(file) {
  const allowed = ['image/jpeg','image/jpg','image/png','image/gif','image/webp']
  if (!allowed.includes(file.type)) throw new Error('Only JPG, PNG, GIF, or WebP allowed.')
  if (file.size > 5*1024*1024) throw new Error('Image must be under 5MB.')
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = e => res(e.target.result)
    r.onerror = () => rej(new Error('Failed to read file'))
    r.readAsDataURL(file)
  })
}
