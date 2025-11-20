import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz98dFM751zvalTz3oQVJvDl1ERsfAU2ZkMQWSsNVANE_mxu9Wf1sH1elqxSEBM4rCn4g/exec";

app.get("/", async (req, res) => {
  try {
    const { proveedor, factura } = req.query;
    const url = new URL(SCRIPT_URL);
    if (proveedor) url.searchParams.append("proveedor", proveedor);
    if (factura) url.searchParams.append("factura", factura);

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json({
      status: "success",
      count: Array.isArray(data) ? data.length : 1,
      data: Array.isArray(data) ? data : [data],
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({
      status: "error",
      message: "Error al obtener los datos desde Google Apps Script.",
      details: err.message,
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Proxy escuchando en puerto ${PORT}`);
});
