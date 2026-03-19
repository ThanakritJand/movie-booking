const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ข้อมูลหนัง 10 เรื่อง
const movies = [
  { id: 1, title: "Avatar: Way of Water", price: 160, img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400" },
  { id: 2, title: "John Wick 4", price: 180, img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400" },
  { id: 3, title: "The Super Mario", price: 140, img: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400" },
  { id: 4, title: "Oppenheimer", price: 200, img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400" },
  { id: 5, title: "Barbie", price: 140, img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400" },
  { id: 6, title: "Spider-Man", price: 150, img: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400" },
  { id: 7, title: "Interstellar", price: 160, img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400" },
  { id: 8, title: "The Batman", price: 180, img: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400" },
  { id: 9, title: "Inception", price: 160, img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400" },
  { id: 10, title: "Black Panther", price: 150, img: "https://images.unsplash.com/photo-1500462859194-885860d117c7?w=400" }
];

// เก็บที่นั่งแยกตามเรื่อง
let movieSeatsStore = {};
movies.forEach(m => {
  movieSeatsStore[m.id] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `${String.fromCharCode(65 + Math.floor(i/5))}${(i%5)+1}`,
    isBooked: Math.random() < 0.2
  }));
});

app.get('/api/movies', (req, res) => res.json(movies));
app.get('/api/seats/:id', (req, res) => res.json(movieSeatsStore[req.params.id]));
app.post('/api/book', (req, res) => {
  const { movieId, seatIds, movieTitle, seatsNames } = req.body;
  movieSeatsStore[movieId] = movieSeatsStore[movieId].map(s => 
    seatIds.includes(s.id) ? { ...s, isBooked: true } : s
  );
  res.json({ success: true, summary: { title: movieTitle, seats: seatsNames, total: seatsNames.length * movies.find(m => m.id == movieId).price } });
});

app.listen(3000, () => console.log('Backend on port 3000'));