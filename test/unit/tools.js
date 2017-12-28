export const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

    try {
      expect(mutation.type).toBe(type)
      if (payload) {
        expect(mutation.payload).toMatchObject(payload)
      }
    } catch (error) {
      done(error)
    }

    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }
  action({ commit, state, dispatch: () => {} }, payload)
  if (expectedMutations.length === 0) {
    expect(count).toBe(0)
    done()
  }
}
