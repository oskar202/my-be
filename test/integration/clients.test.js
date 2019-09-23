const chai = require('chai');

const chaiHttp = require('chai-http');
const config = require('../helpers/config');

const { expect } = chai;

chai.use(chaiHttp);

const api = chai.request(`localhost:3000${config.apiPath}`);

const postClient = () => api
	.post('/clients/')
	.send({ phoneNumber: '+4407111122223333', firstname: 'Oskar', surname: 'Surname' });

it('Should insert client', () => {
	postClient()
		.end((err, res) => {
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('client');
		});
});

it('Should get all clients', () => {
	api
		.get('/clients')
		.end((err, res) => {
			expect(res).to.have.status(200);
			expect(err).to.be.null;
		});
});

it('Should get client by id', (done) => {
	postClient()
		.then((res) => {
			expect(res).to.have.status(200);
			api
				.get(`/clients/${res.body.client}`)
				.then((response) => {
					expect(response).to.have.status(200);
					expect(response.body.phonenumber).eq('+4407111122223333');
					expect(response.body.firstname).eq('Oskar');
					expect(response.body.surname).eq('Surname');
					done();
				})
				.catch((err) => {
					throw err;
				});
		});
});

it('Should update client', (done) => {
	postClient()
		.then((res) => {
			expect(res).to.have.status(200);
			api
				.put('/clients/update')
				.send({ id: res.body.client, firstname: 'NewName', surname: 'Surname' })
				.end((err, response) => {
					expect(response).to.have.status(200);
					expect(response.body.message).eq('success');
					done();
				});
		});
});

it('Should delete client', (done) => {
	postClient()
		.then((res) => {
			expect(res).to.have.status(200);
			api
				.delete(`/clients/${res.body.client}`)
				.end((err, response) => {
					expect(response).to.have.status(200);
					done();
				});
		});
});
