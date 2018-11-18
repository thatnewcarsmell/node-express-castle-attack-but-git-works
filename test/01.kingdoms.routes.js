const app = require('../app')
const chai = require('chai')
const expect = chai.expect
const { Kingdom } = require('galvanize-game-mechanics')

chai.use(require('chai-http'))

describe('Castle Attack', function () {
  describe('Kingdoms Resource', function () {
    describe('POST /kingdoms', function () {
      it('should create a new kingdom or change the name if it exists', function (done) {
        const name = 'My Kingdom'
        chai.request(app)
          .post(`/kingdoms`)
          .send({ name })
          .end((err, res) => {
            expect(res.status).to.equal(201)
            expect(res.body.data).to.be.ok
            expect(res.body.data.id).to.be.ok
            expect(res.body.data.name).to.equal(name)
            expect(res.body.data.castles).to.not.be.ok
            done()
          })
      })
    })

    describe('GET /kingdoms', function () {
      it('retrieve a list of all kingdoms', function (done) {
        const name = 'My Kingdom'
        chai.request(app)
          .post(`/kingdoms`)
          .send({ name })
          .end(() => {
            chai.request(app)
            .get(`/kingdoms`)
            .end((err, res) => {
              expect(res.status).to.equal(200)
              expect(res.body.data).to.be.ok
              
              const [ kingdom ] = res.body.data
              expect(kingdom.id).to.be.ok
              expect(kingdom.name).to.equal(name)
              expect(kingdom.castles).to.not.be.ok
              done()
            })
          })
      })
    })

    describe('GET /kingdoms/:id', function (done) {
      it('should retrieve the specified kingdom', function (done) {
        const name = 'My Kingdom'
        chai.request(app)
          .post(`/kingdoms`)
          .send({ name })
          .end((err, { body: { data }}) => {
            chai.request(app)
              .get(`/kingdoms/${data.id}`)
              .end((err, res) => {
                expect(res.status).to.equal(200)
                expect(res.body.data).to.be.ok
                expect(res.body.data.id).to.equal(data.id)
                expect(res.body.data.name).to.equal(data.name)
                expect(res.body.data.castles).to.not.be.ok
                done()
              })
          })
      })
      it('should return an error if that kingdom does not exist', function (done) {
        const name = 'My Kingdom'
        chai.request(app)
          .post(`/kingdoms`)
          .send({ name })
          .end(() => {
            chai.request(app)
              .get(`/kingdoms/2`)
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