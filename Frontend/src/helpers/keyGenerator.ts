/**
 * Generates a key from a name by extracting uppercase letters and numbers
 * @param name The name to generate a key from
 * @param maxLength Maximum length of the generated key (default: 10)
 * @returns The generated key
 */
export function generateKeyFromName(name: string, maxLength: number = 10): string {
  return (name || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, maxLength)
}

/**
 * Creates a state updater function that auto-generates a key from a name field
 * @param setData State setter function
 * @param isKeyManuallyEdited Whether the key has been manually edited
 * @param setIsKeyManuallyEdited Setter for manual edit state
 * @returns Update function to be used in components
 */
export function createKeyAutoGenerator<T extends { name: string; key: string }>(
  setData: React.Dispatch<React.SetStateAction<T>>,
  isKeyManuallyEdited: boolean,
  setIsKeyManuallyEdited: React.Dispatch<React.SetStateAction<boolean>>
) {
  return (field: keyof T, value: string | undefined) => {
    setData((prev) => {
      const newData = { ...prev, [field]: value }

      // Auto-generate key from name if key hasn't been manually edited
      if (field === 'name' && !isKeyManuallyEdited) {
        newData.key = generateKeyFromName(value || '') as T['key']
      }

      return newData
    })

    // Mark key as manually edited if user changes it
    if (field === 'key') {
      setIsKeyManuallyEdited(true)
    }
  }
}
