import { getAll, getById, create, updateById, deleteById } from '../store.mjs'
import { restoreDb, populateDb } from './utils.js'
import { whispers, inventedId, existingId } from './fixtures.js'

describe('Store', () => {
  beforeEach(() => populateDb(whispers))
  afterAll(restoreDb)

  describe('getAll', () => {
    it('Harusnya mengembalikan sebuah array kosong ketika tidak ada data', async () => {
      restoreDb()
      const data = await getAll()
      expect(data).toEqual([])
    })
    it('Seharusnya mengembalikan sebuah array setidaknya satu item di db', async () => {
      const data = await getAll()
      expect(data).toEqual(whispers)
    })
  })

  describe('getById', () => {
    it('Seharusnya mengembalikan undefined ketika item tidak memberikan item id', async () => {
      const item = await getById(inventedId)
      expect(item).toBeUndefined()
    })

    it('Seharusnya mengembalikan item dengan mengembalikan id', async () => {
      const item = await getById(whispers[0].id)
      expect(item).toEqual(whispers[0])
    })
  })

  describe('create', () => {
    it('Should return the created item', async () => {
      const newItem = { id: whispers.length + 1, message: 'test 3' }
      const item = await create(newItem.message)
      expect(item).toEqual(newItem)
    })
    it('Should add the item to the db', async () => {
      const newItem = { id: whispers.length + 1, message: 'test 3' }
      const { id } = await create(newItem.message)
      const item = await getById(id)
      expect(item).toEqual(newItem)
    })
  })

  describe('updateById', () => {
    it('Seharusnya mengembalikan undefined ketika tidak ada item yang mengembalikan id', async () => {
      const item = await updateById(inventedId)
      expect(item).toBeUndefined()
    })
    it('Seharusnya tidak mengembalikan item update', async () => {
      const updatedItem = { id: existingId, message: 'updated' }

      const item = await updateById(updatedItem.id, updatedItem.message)
      expect(item).toBeUndefined()
    })

    it('Seharusnya update item di db', async () => {
      const updatedItem = { id: existingId, message: 'updated' }
      await updateById(updatedItem.id, updatedItem.message)

      const item = await getById(existingId)
      expect(item).toEqual(updatedItem)
    })
  })

  describe('deleteById', () => {
    it('Should return undefined when there is no item with the given id', async () => {
      const item = await deleteById(inventedId)
      expect(item).toBeUndefined()
    })
    it('Should not return the deleted item', async () => {
      const item = await deleteById(existingId)
      expect(item).toBeUndefined()
    })

    it('Should delete the item from the db', async () => {
      await deleteById(existingId)
      const items = await getAll()
      expect(items).toEqual(whispers.filter((item) => item.id !== existingId))
    })
  })
})
