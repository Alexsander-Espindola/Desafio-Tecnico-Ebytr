const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const { expect } = chai;

// simulando requests http

chai.use(chaiHttp);

// mock de banco de dados em memoria

const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

//

const server = require('../server/app');

const user = {
  name: 'Rogerinho',
  email: 'rogerinho@gmail.com',
  password: '123451',
};

const loginUser = {
  email: 'rogerinho@gmail.com',
  password: '123451',
};

describe('POST /login', () => {
  describe('É esperado ao fazer login de um usuário:', () => {
    let DBServer;
    let response;

    afterEach(async () => {
      MongoClient.connect.restore();
      await DBServer.stop();
    });

    describe('Quando é criado com sucesso', () => {
      beforeEach(async () => {
        DBServer = new MongoMemoryServer();
        const URLMock = await DBServer.getUri();
        const connectionMock = MongoClient.connect(
          URLMock,
          { useNewUrlParser: true, useUnifiedTopology: true },
        );

        sinon.stub(MongoClient, 'connect')
          .resolves(connectionMock);

        await chai.request(server)
          .post('/user')
          .set('content-type', 'application/json')
          .send(user);

        response = await chai.request(server)
          .post('/login')
          .set('content-type', 'application/json')
          .send(loginUser);
      });

      it('retorna o código de status 200 OK', () => {
        expect(response).to.have.status(200);
      });

      it('retorna um objeto com a propriedade "token"', () => {
        expect(response.body).to.be.a('object');
        expect(response.body).to.have.property('token');
        expect(response.body.token).to.exist('exist');
      });
    });

    describe('Quando é logado com falha', () => {
      beforeEach(async () => {
        DBServer = new MongoMemoryServer();
        const URLMock = await DBServer.getUri();
        const connectionMock = MongoClient.connect(
          URLMock,
          { useNewUrlParser: true, useUnifiedTopology: true },
        );

        sinon.stub(MongoClient, 'connect')
          .resolves(connectionMock);

        await chai.request(server)
          .post('/user')
          .set('content-type', 'application/json')
          .send(user);
      });

      it('Será validado que o campo "email" é obrigatório', (done) => {
        response = chai.request(server)
          .post('/login')
          .set('content-type', 'application/json')
          .send({
            password: '123451',
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).to.be.deep.equal({ code: 401, message: '"email" is required' });
            done();
          });
      });

      it('Será validado que o campo "password" é obrigatório', (done) => {
        response = chai.request(server)
          .post('/login')
          .set('content-type', 'application/json')
          .send({
            email: 'rogerinho@gmail.com',
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).to.be.deep.equal({ code: 401, message: '"password" is required' });
            done();
          });
      });

      it('Será validado que não é possível fazer login com um email inválido', (done) => {
        response = chai.request(server)
          .post('/login')
          .set('content-type', 'application/json')
          .send({
            email: 'rogerinho@.com',
            password: '123451',
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).to.be.deep.equal({ code: 401, message: 'Invalid Email' });
          });
      });

      it('Será validado que não é possível fazer login com uma senha inválida', (done) => {
        response = chai.request(server)
          .post('/login')
          .set('content-type', 'application/json')
          .send({
            email: 'rogerinho@gmail',
            password: 'fd2134sa',
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).to.be.deep.equal({ code: 401, message: 'Incorrect email or password' });
          });
      });
    });
  });
});
