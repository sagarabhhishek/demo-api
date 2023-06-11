import express from "express";
import cors from "cors";
import sql from "mssql";
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

dotenv.config();

const config = {
  server: process.env.SERVER,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  trustServerCertificate: true,
};

const connectToDB = async () => {
  try {
    await sql.connect(config);
    console.log("Connected to SQL Server");
  } catch (err) {
    console.log("Error connecting to SQL Server:", err);
  }
};

// Add/Create Customer

app.post("/api/customers", (req, res) => {
  const { name, email, phone } = req.body;

  const query = `INSERT INTO CustomerDEMO (Name, Email, Phone) VALUES (@Name, @Email, @Phone)`;

  const request = new sql.Request();

  request.input("Name", sql.NVarChar, name);
  request.input("Email", sql.NVarChar, email);
  request.input("Phone", sql.NVarChar, phone);

  request.query(query, (err, result) => {
    if (err) {
      console.log("Error creating customer:", err);
      res.status(500).send("Error creating customer");
    } else {
      res.status(201).send("Customer created Successfully");
    }
  });
});

// Get Customer

app.get("/api/customers/:id", (req, res) => {
  const customerId = req.params.id;

  const query = `SELECT * FROM CustomerDEMO WHERE CustomerId = @CustomerId`;

  const request = new sql.Request();

  request.input("CustomerId", sql.Int, customerId);

  request.query(query, (err, result) => {
    if (err) {
      console.log("Error fetching customer:", err);
      res.status(500).send("Error fetching customer");
    } else {
      if (result.recordset.length === 0) {
        res.status(404).send("Customer not found");
      } else {
        res.status(200).send(result.recordset[0]);
      }
    }
  });
});

// Get all Customer

app.get("/api/customers", (req, res) => {
  const query = `SELECT * FROM CustomerDEMO`;

  const request = new sql.Request();

  request.query(query, (err, result) => {
    if (err) {
      console.log("Error fetching customers:", err);
      res.status(500).send("Error fetching customers");
    } else {
      res.status(200).send(result.recordset);
    }
  });
});

// Update Customer

app.put("/api/customers/:id", (req, res) => {
  const customerId = req.params.id;
  const { name, email, phone } = req.body;

  const query = `UPDATE CustomerDEMO SET Name = @Name, Email = @Email, Phone = @Phone WHERE CustomerId = @CustomerId`;

  const request = new sql.Request();

  request.input("Name", sql.NVarChar, name);
  request.input("Email", sql.NVarChar, email);
  request.input("Phone", sql.NVarChar, phone);
  request.input("CustomerId", sql.Int, customerId);

  request.query(query, (err, result) => {
    if (err) {
      console.log("Error updating customer:", err);
      res.status(500).send("Error updating customer");
    } else {
      res.status(200).send("Customer updated successfully");
    }
  });
});

// Delete Customer

app.delete("/api/customers/:id", (req, res) => {
  const customerId = req.params.id;

  const query = `DELETE FROM CustomerDEMO WHERE CustomerId = @CustomerId`;

  const request = new sql.Request();

  request.input("CustomerId", sql.Int, customerId);

  request.query(query, (err, result) => {
    if (err) {
      console.log("Error deleting customer:", err);
      res.status(500).send("Error deleting customer");
    } else {
      res.status(200).send("Customer deleted successfully");
    }
  });
});

// const executeQuery = async (query) => {
//   try {
//     const result = await sql.query(query);
//     console.log("Result afer executing query:", result);
//   } catch (err) {
//     console.log("Error executing query:", err);
//   }
// };

const closeConnection = async () => {
  try {
    await sql.close();
    console.log("Connection closed");
  } catch (err) {
    console.log("Error closing connection:", err);
  }
};

connectToDB();

// const query = "SELECT * FROM CustomerDEMO";
// executeQuery(query);

// closeConnection();

// const port = 3000;

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
