# 🌾 KisanMart — Direct Agricultural Supply Chain & Logistics Network

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_6.0+-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9+-199900?style=flat&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An enterprise-grade, full-stack MERN platform built to disintermediate agricultural supply chains. KisanMart bridges primary producers (Farmers) directly with commercial retailers (Shopkeepers) while orchestrating an on-demand freight network (Drivers) and platform governance (Admin).

---

## 📌 Table of Contents

- [Key Architecture & Features](#-key-architecture--features)
- [System State Machine](#-system-state-machine)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Variables Configuration](#-environment-variables-configuration)
- [Local Setup & Installation](#-local-setup--installation)
- [Seed Admin Account](#-seed-admin-account)
- [API Documentation](#-api-documentation)
- [WebSocket Telematics Protocol](#-websocket-telematics-protocol)

---

## 🚀 Key Architecture & Features

- **Role-Based Access Control (RBAC):** Distinct workflows for `FARMER`, `SHOPKEEPER`, `DRIVER`, and `ADMIN` secured by JWT authentication.
- **Spot Market & Forward Pre-Booking:**
  - **Spot Produce:** Instant purchasing of already-harvested crops.
  - **Future Harvest Yields:** Forward contracts locked against scheduled harvest dates.
- **Atomic Inventory Guarantees:** Concurrent pre-booking protected using MongoDB document-level atomic operators (`$inc` and `$gte`), preventing overselling during race conditions.
- **Real-Time Logistics Telematics:** Driver geolocation broadcasted via Socket.IO directly to Leaflet OpenStreetMap canvas widgets without polling overhead.
- **Automated Tax Invoicing:** On-the-fly binary streaming of GST-compliant agricultural invoices via `pdfkit` upon delivery settlement.
- **Platform Analytics Engine:** Admin telemetry tracking Gross Merchandise Value (GMV), 5% platform commission splits, driver freight margins, and participant audit trails.

---

## 🔄 System State Machine

KisanMart enforces a deterministic 9-stage order lifecycle:

```text
[PREBOOKED] (Future Harvest)
     │
     ▼ (Farmer harvests crop)
[READY_FOR_PICKUP] ◄────────────── [PLACED] (Spot Purchase)
     │
     ▼ (Freight Driver claims load)
[DRIVER_ASSIGNED]
     │
     ▼ (Driver arrives at farm)
[PICKED_UP]
     │
     ▼ (Driver initiates route; WebSockets activate)
[IN_TRANSIT]
     │
     ▼ (Drop-off confirmed at retail shop)
[DELIVERED] ──► Automated PDF Tax Invoice Generation & Ledger Settlement