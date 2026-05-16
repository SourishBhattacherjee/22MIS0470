import express from 'express';
import request from 'supertest';
import vehicleRoutes from '../routes/vehicleRoutes';
import Vehicle from '../models/Vehicle';

// Mock logging middleware to avoid console clutter
jest.mock('logging_middleware', () => ({
  Log: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/vehicles', vehicleRoutes);

describe('Vehicle Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/vehicles', () => {
    it('should return all vehicles', async () => {
      const mockVehicles = [
        { _id: '1', make: 'Toyota', model: 'Camry', year: 2022, licensePlate: 'ABC-123' }
      ];
      jest.spyOn(Vehicle, 'find').mockResolvedValue(mockVehicles as any);

      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockVehicles);
      expect(Vehicle.find).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
      jest.spyOn(Vehicle, 'find').mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Database error');
    });
  });

  describe('GET /api/vehicles/:id', () => {
    it('should return a vehicle by id', async () => {
      const mockVehicle = { _id: '1', make: 'Toyota', model: 'Camry', year: 2022 };
      jest.spyOn(Vehicle, 'findById').mockResolvedValue(mockVehicle as any);

      const response = await request(app).get('/api/vehicles/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockVehicle);
    });

    it('should return 404 if vehicle not found', async () => {
      jest.spyOn(Vehicle, 'findById').mockResolvedValue(null as any);

      const response = await request(app).get('/api/vehicles/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Vehicle not found');
    });
  });

  describe('POST /api/vehicles', () => {
    it('should create a vehicle', async () => {
      const vehicleData = { make: 'Honda', model: 'Civic', year: 2021, licensePlate: 'XYZ-789' };
      const savedVehicle = { _id: '2', ...vehicleData };
      
      jest.spyOn(Vehicle.prototype, 'save').mockResolvedValue(savedVehicle as any);

      const response = await request(app)
        .post('/api/vehicles')
        .send(vehicleData);

      expect(response.status).toBe(201);
      expect(Vehicle.prototype.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('should update a vehicle', async () => {
      const mockVehicle = { _id: '1', make: 'Toyota', model: 'Camry', year: 2023 };
      jest.spyOn(Vehicle, 'findByIdAndUpdate').mockResolvedValue(mockVehicle as any);

      const response = await request(app)
        .put('/api/vehicles/1')
        .send({ year: 2023 });

      expect(response.status).toBe(200);
      expect(response.body.year).toBe(2023);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should delete a vehicle', async () => {
      jest.spyOn(Vehicle, 'findByIdAndDelete').mockResolvedValue({ _id: '1' } as any);

      const response = await request(app).delete('/api/vehicles/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Vehicle deleted successfully');
    });
  });
});
