const app = require('../app')
const chai = require('chai')
const expect = chai.expect
const { Kingdom } = require('galvanize-game-mechanics')

chai.use(require('chai-http'))

describe('Castle Attack', function () {
  describe('Castles Resource', function () {
    describe('POST /kingdoms/:id/castles', function () {
      it('should create a new castle', function (done) {
        chai.request(app)
          .post(`/kingdoms`)
          .end((err, { body: { data: kingdom } }) => {
            chai.request(app)
              .post(`/kingdoms/${kingdom.id}/castles`)
              .end((err, res) => {
                expect(res.status).to.equal(201)
                expect(res.body.data).to.be.an('object')
                expect(res.body.data.name).to.be.ok
                expect(res.body.data.health).to.be.a('number')
                done()
              })
          })
      })

      it('should create a new castle with a specified name', function (done) {
        chai.request(app)
          .post(`/kingdoms`)
          .end((err, { body: { data: kingdom } }) => {
            const name = 'My Castle'
            chai.request(app)
              .post(`/kingdoms/${kingdom.id}/castles`)
              .send({ name })
              .end((err, res) => {
                expect(res.status).to.equal(201)
                expect(res.body.data).to.be.an('object')
                expect(res.body.data.name).to.equal(name)
                done()
              })
        })
      })

      it('should return an error if a castle cannot be created', function (done) {
        chai.request(app).post(`/kingdoms`).end((err, { body: { data: kingdom }}) => {
            chai.request(app).post(`/kingdoms/${kingdom.id}/castles`).end(() => {
                chai.request(app).post(`/kingdoms/${kingdom.id}/castles`).end(() => {
                  chai.request(app).post(`/kingdoms/${kingdom.id}/castles`).end(() => {
                      chai.request(app)
                        .post(`/kingdoms/${kingdom.id}/castles`)
                        .end((err, res) => {
                          expect(res.status).to.equal(400)
                          expect(res.body.error).to.be.an('object')
                          expect(res.body.error.message).to.be.ok
                          done()
                        })
                    })
                  })
              })
          })
      })

      it('should throw an error if the kingdom id does not match the kingdom', function (done) {
        chai.request(app)
          .get(`/kingdoms/10/castles`)
          .end((err, res) => {
            expect(res.status).to.equal(404)
            expect(res.body.error).to.be.an('object')
            expect(res.body.error.message).to.be.ok
            done()
          })
      })
    })

    describe('GET /kingdoms/:id/castles', function (done) {
      it('should retrieve all specified castles', function (done) {
        chai.request(app)
          .post(`/kingdoms`)
          .end((err, { body: { data: kingdom } }) => {
            chai.request(app)
              .get(`/kingdoms/${kingdom.id}/castles`)
              .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body.data).to.be.an('array')
                expect(res.body.data.length).to.equal(0)
                done()
              })
          })
      })

      it('should throw an error if the kingdom id does not match the kingdom', function (done) {
        chai.request(app)
          .post(`/kingdoms`)
          .end((err, { body: { data: kingdom } }) => {

          chai.request(app)
            .get(`/kingdoms/10/castles`)
            .end((err, res) => {
              expect(res.status).to.equal(404)
              expect(res.body.error).to.be.an('object')
              expect(res.body.error.message).to.be.ok
              done()
            })
        })
      })
    })

    describe('GET /kingdoms/:id/castles/:castleId', function (done) {
      it('should retrieve the specified castle', function (done) {
        chai.request(app)
          .post(`/kingdoms`)
          .end((err, { body: { data: kingdom } }) => {
            chai.request(app)
              .post(`/kingdoms/${kingdom.id}/castles`)
              .end((err, { body: { data: castle } }) => {
                chai.request(app)
                  .get(`/kingdoms/${kingdom.id}/castles/${castle.id}`)
                  .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body.data).to.be.ok
                    expect(res.body.data).to.deep.equal(castle)
                    done()
                  })
              })
          })
      })

      it('should return an error if that castle does not exist', function (done) {
        chai.request(app)
          .post(`/kingdoms`)
          .end((err, { body: { data: kingdom } }) => {
            chai.request(app)
              .get(`/kingdoms/${kingdom.id}/castles/1`)
              .end((err, res) => {
                expect(res.status).to.equal(404)
                expect(res.body.error).to.be.an('object')
                expect(res.body.error.message).to.be.ok
                done()
              })
          })
      })

      it('should throw an error if the kingdom id does not match the kingdom', function (done) {
        chai.request(app)
          .post(`/kingdoms`)
          .end((err, { body: { data: kingdom } }) => {
            chai.request(app)
              .post(`/kingdoms/${kingdom.id}/castles`)
              .end((err, { body: { data: castle } }) => {
                chai.request(app)
                  .get(`/kingdoms/10/castles/${castle.id}`)
                  .end((err, res) => {
                    expect(res.status).to.equal(404)
                    expect(res.body.error).to.be.an('object')
                    expect(res.body.error.message).to.be.ok
                    done()
                  })
              })
          })
      })
    })

    describe('POST /kingdoms/:id/castles/:castleId', function () {
      it('should, when given the action \'attack\', deal damage to the specified castle', function (done) {
        chai.request(app)
          .post(`/kingdoms`)
          .end((err, { body: { data: kingdom } }) => {
            chai.request(app)
              .post(`/kingdoms/${kingdom.id}/castles`)
              .end((err, { body: { data: castle } }) => {
                const previousHealth = castle.health
                chai.request(app)
                  .post(`/kingdoms/${kingdom.id}/castles/${castle.id}`)
                  .send({ action: 'attack' })
                  .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data.health).to.be.below(previousHealth)
                    done()
                  })
              })
          })
      })

      it('should, when given the action \'build\', restore the specified castle', function (done) {
        chai.request(app)
          .post(`/kingdoms`)
          .end((err, { body: { data: kingdom } }) => {
            chai.request(app)
              .post(`/kingdoms/${kingdom.id}/castles`)
              .end((err, { body: { data: castle } }) => {
                const previousHealth = castle.health
                chai.request(app)
                  .post(`/kingdoms/${kingdom.id}/castles/${castle.id}`)
                  .send({ action: 'build' })
                  .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data.health).to.be.above(previousHealth)
                    done()
                  })
              })
          })
      })

      it('should, when given an unspecified action, return an error', function (done) {
        chai.request(app)
          .post(`/kingdoms`)
          .end((err, { body: { data: kingdom } }) => {
            chai.request(app)
              .post(`/kingdoms/${kingdom.id}/castles`)
              .end((err, { body: { data: castle } }) => {
                chai.request(app)
                  .post(`/kingdoms/${kingdom.id}/castles/${castle.id}`)
                  .send({ action: 'explodey' })
                  .end((err, res) => {
                    expect(res.status).to.equal(400)
                    expect(res.body.error).to.be.an('object')
                    expect(res.body.error.message).to.be.ok
                    done()
                  })
              })
          })
      })

      it('should return an error if that castle does not exist', function (done) {
        chai.request(app)
          .get(`/kingdoms/1/castles/1`)
          .end((err, res) => {
            expect(res.status).to.equal(404)
            expect(res.body.error).to.be.an('object')
            expect(res.body.error.message).to.be.ok
            done()
          })
      })

      it('should throw an error if the kingdom id does not match the kingdom', function (done) {
        chai.request(app)
          .post(`/kingdoms`)
          .end((err, { body: { data: kingdom } }) => {
            chai.request(app)
              .post(`/kingdoms/${kingdom.id}/castles`)
              .end((err, { body: { data: castle } }) => {
                chai.request(app)
                  .get(`/kingdoms/10/castles/${castle.id}`)
                  .end((err, res) => {
                    expect(res.status).to.equal(404)
                    expect(res.body.error).to.be.an('object')
                    expect(res.body.error.message).to.be.ok
                    done()
                  })
              })
          })
      })
    })
  })
})
