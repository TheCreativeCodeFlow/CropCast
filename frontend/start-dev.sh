#!/bin/bash

echo "Starting CropCast Agricultural Platform..."
echo

echo "[1/3] Starting MongoDB..."
mongod &

echo "[2/3] Starting Backend Server..."
cd backend && npm run dev &

echo "[3/3] Starting Frontend Development Server..."
sleep 3
npm run dev &

echo
echo "========================================"
echo "CropCast Platform is starting up..."
echo "========================================"
echo "Backend API: http://localhost:5000/api"
echo "Frontend App: http://localhost:5173"  
echo "========================================"
echo

wait