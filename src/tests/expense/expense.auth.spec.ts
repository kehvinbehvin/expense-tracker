const request = require('supertest');

import app from "../../app"

describe("GET /api/v0/expense/:id", () => {
    it('deny access', function() {
        request(app)
            .get('/api/v0/expense/1')
            .set('Accept', 'application/json')
            .expect(403,"A token is required for authentication")
            .end((err: any, res: any) => {
                if (err) throw err;
                // console.log(res.body);
          })
        
      });

      it('Invalid jwt token', function() {
        request(app)
            .get('/api/v0/expense/1')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + "HELLO")
            .expect(401,"Invalid Token")
            .end((err: any, res: any) => {
                if (err) throw err;
                // console.log(res.body);
          })
        
      });

      it('wrong authentication method', function() {
        request(app)
            .get('/api/v0/expense/1')
            .set('Accept', 'application/json')
            .set('Authorization', 'Random' + "HELLO")
            .expect(403,"Wrong authentication method")
            .end((err: any, res: any) => {
                if (err) throw err;
                // console.log(res.body);
          })
        
      });
})
