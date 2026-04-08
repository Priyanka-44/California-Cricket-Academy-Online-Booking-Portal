import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../components/Footer";

function MyBatches() {

  const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://california-cricket-academy-online.onrender.com/api/batches",
        {
          headers:{
            Authorization: token
          }
        }
      );

      setBatches(res.data);

    } catch (error) {

      console.log("Error loading batches");

    }

  };

  return (

    <div style={{ padding:"40px" }}>

      <h1>My Batches</h1>

      {batches.map((batch)=>(
        <div
          key={batch._id}
          style={{
            border:"1px solid #ccc",
            padding:"20px",
            marginTop:"15px",
            borderRadius:"10px"
          }}
        >

          <h3>{batch.title}</h3>
          <p>Age Group: {batch.ageGroup}</p>
          <p>Level: {batch.level}</p>

        </div>
      ))}
      <Footer />
    </div>

  );

}

export default MyBatches;