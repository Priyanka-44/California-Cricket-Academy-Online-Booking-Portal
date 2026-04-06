import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrophy, FaUsers, FaStar, FaClock } from "react-icons/fa";

function Home() {

const programs = [
  { 
    title:"Junior Cricket", 
    age:"Age: 8-12 years", 
    price:"₹3,000/month", 
    img:"https://res.cloudinary.com/djaoro6z5/image/upload/v1774591926/Junior_Cricket_fsnuhc.jpg" 
  },
  { 
    title:"Teen Academy",  
    age:"Age: 13-17 years", 
    price:"₹4,500/month", 
    img:"https://res.cloudinary.com/djaoro6z5/image/upload/v1774592040/Teen_Academy_tkc0bh.jpg" 
  },
  { 
    title:"Elite Squad",    
    age:"Age: 16-22 years", 
    price:"₹7,000/month", 
    img:"https://res.cloudinary.com/djaoro6z5/image/upload/v1774592223/Elite_Squad_mcugno.png" 
  }
];

const coaches = [
  { 
    name:"Rahul Sharma", 
    role:"Batting",     
    exp:"10 years experience", 
    img:"https://images.unsplash.com/photo-1546519638-68e109498ffc" 
  },
  { 
    name:"Priya Patel",  
    role:"Bowling",     
    exp:"8 years experience",  
    img:"https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972" 
  },
  { 
    name:"Amit Kumar",   
    role:"All-rounder", 
    exp:"12 years experience", 
    img:"https://images.unsplash.com/photo-1540747913346-19e32dc3e97e" 
  }
];

const facilities = [
  { 
    title:"Main Stadium",    
    img:"https://res.cloudinary.com/djaoro6z5/image/upload/v1774592767/main_stadium_for_cricket_acdeumy_pefvva.jpg" 
  },
  { 
    title:"Indoor Nets",     
    img:"https://res.cloudinary.com/djaoro6z5/image/upload/v1774591824/Indoor_Nets_j4rrjd.jpg" 
  },
  { 
    title:"Training Grounds",
    img:"https://res.cloudinary.com/djaoro6z5/image/upload/v1775217520/6_tfij4w.jpg" 
  },
  { 
    title:"Equipment Room",  
    img:"https://res.cloudinary.com/djaoro6z5/image/upload/v1774592499/EquipmentRoom_uricwq.webp" 
  },
  { 
    title:"Coaching Area",   
    img:"https://res.cloudinary.com/djaoro6z5/image/upload/v1774591692/Coaching_Area_kxmrej.jpg" 
  },
  { 
    title:"Practice Nets",   
    img:"https://res.cloudinary.com/djaoro6z5/image/upload/v1774591998/net_practice_ivvvkr.jpg" 
  }
];

return (
<div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

  {/* HERO */}
  <section className="h-[80vh] flex items-center justify-center text-center bg-cover bg-center"
    style={{ backgroundImage:"url('/images/hero2.webp')" }}>
    <div className="bg-black/60 w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-4">Master the Game of Cricket</h1>
      <p className="max-w-xl text-gray-300 mb-6">Professional coaching, world-class facilities, and a pathway to excellence</p>
      <Link to="/programs" className="bg-green-500 hover:bg-green-400 px-6 py-3 rounded-full font-semibold transition-all">
        Join Academy →
      </Link>
    </div>
  </section>

  {/* WHY CHOOSE */}
  <section className="max-w-[1300px] mx-auto py-20 px-6">
    <h2 className="text-center text-3xl font-bold mb-2">Why Choose Us</h2>
    <p className="text-center text-gray-400 mb-12">Excellence in every aspect of cricket training</p>
    <div className="grid md:grid-cols-4 gap-8">
      {[
        { 
          icon:<FaTrophy/>, 
          title:"Expert Coaches",       
          desc:"Learn from experienced professionals" 
        },
        { 
          icon:<FaUsers/>,  
          title:"Small Batches",        
          desc:"Personalized attention for every student" 
        },
        { 
          icon:<FaStar/>,   
          title:"World-class Facilities",
          desc:"State of the art training grounds" 
        },
        { 
          icon:<FaClock/>,  
          title:"Flexible Timings",     
          desc:"Sessions that fit your schedule" 
        },
      ].map((item,i)=>(
        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/8 transition-all">
          <div className="text-white-400 text-2xl mb-4">{item.icon}</div>
          <h3 className="font-semibold text-white mb-1">{item.title}</h3>
          <p className="text-gray-400 text-sm">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>

  {/* PROGRAMS */}
  <section className="max-w-[1300px] mx-auto px-6 pb-20">
    <h2 className="text-center text-3xl font-bold mb-10">Featured Programs</h2>
    <div className="grid md:grid-cols-3 gap-8">
      {programs.map((p,i)=>(
        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-green-500/30 transition-all">
          <img src={p.img} className="h-48 w-full object-cover" alt={p.title}/>
          <div className="p-5">
            <h3 className="font-semibold text-white">{p.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{p.age}</p>
            <p className="text-green-400 mt-2 font-semibold">{p.price}</p>
            <Link to="/programs">
              <button className="mt-3 bg-green-500 hover:bg-green-400 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  </section>

  {/* COACHES */}
  <section className="max-w-[1300px] mx-auto px-6 pb-20">
    <h2 className="text-center text-3xl font-bold mb-10">Our Expert Coaches</h2>
    <div className="grid md:grid-cols-3 gap-8">
      {coaches.map((c,i)=>(
        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-green-500/30 transition-all">
          <img src={c.img} className="h-48 w-full object-cover" alt={c.name}/>
          <div className="p-5">
            <h3 className="font-semibold text-white">{c.name}</h3>
            <p className="text-green-400 text-sm mt-1">{c.role}</p>
            <p className="text-gray-400 text-sm">{c.exp}</p>
          </div>
        </div>
      ))}
    </div>
  </section>

  {/* TESTI-MONIAL */}
  <section className="text-center py-20 px-6">
    <h2 className="text-3xl font-bold mb-3">What Our Students Say</h2>
    <p className="text-gray-400 mb-8">Success stories from our academy</p>
    <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 rounded-2xl">
      <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-16 h-16 rounded-full mx-auto mb-3" alt="student"/>
      <p className="text-yellow-400 mb-2">★★★★★</p>
      <p className="text-gray-300 italic mb-4">Best cricket academy in the city! The coaches are experienced and really care about each student's progress.</p>
      <h4 className="font-semibold text-white">Arjun Verma</h4>
      <p className="text-gray-400 text-sm">Student</p>
    </div>
  </section>

  {/* FACILITIES */}
  <section className="max-w-[1300px] mx-auto px-6 pb-20">
    <h2 className="text-center text-3xl font-bold mb-10">World-Class Facilities</h2>
    <div className="grid md:grid-cols-3 gap-8">
      {facilities.map((f,i)=>(
        <div key={i} className="rounded-2xl overflow-hidden">
          <img src={f.img} className="h-48 w-full object-cover" alt={f.title}/>
          <p className="mt-2 font-semibold text-white">{f.title}</p>
        </div>
      ))}
    </div>
  </section>

  {/* CTA */}
  <section className="py-20 px-6">
    <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-700 to-emerald-700 text-center py-16 rounded-2xl">
      <h2 className="text-4xl font-bold mb-4">Ready to Start Your Cricket Journey?</h2>
      <p className="mb-6 text-green-100">Join thousands of students who have improved their game with us</p>
      <Link to="/programs" className="bg-white text-green-700 px-6 py-3 rounded-full font-bold hover:bg-green-50 transition-all">
        Explore Programs
      </Link>
    </div>
  </section>

 
</div>
);
}

export default Home;