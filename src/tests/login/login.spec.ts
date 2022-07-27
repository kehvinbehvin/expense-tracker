const request = require('supertest');

import app from "../../app"

describe("GET /api/v0/expense/:id", () => {
    let token: string = "";

    before(function() {
      request(app)
        .post('/api/v0/login')
        .send({ email: "hokevin78@gmail.com", password: "password" })
        .end((err: any, res: any) => {
            if (err) throw err;
            token = res.body.token; 
        })
    });
    it('Should get a expense object', function(done) { 
        request('/api/v0/expense/1')
          .set('Authorization', 'Bearer ' + token)
          .expect(200, done)
          .end((err: any, res: any) => {
            if (err) throw err;
            // console.log(res.body);
        })
      });
})