<template>
  <div class="min-h-screen bg-slate-950 text-white p-6 font-sans">
    <nav class="max-w-6xl mx-auto flex justify-between items-center mb-8">
      <h1 class="text-3xl font-black italic tracking-tighter text-yellow-400">CINE-VUE</h1>
      <button v-if="step !== 'movies'" @click="step = 'movies'" class="bg-slate-800 px-5 py-2 rounded-full text-xs font-bold hover:bg-slate-700">← CHANGE MOVIE</button>
    </nav>

    <main class="max-w-6xl mx-auto">
      
      <div v-if="step === 'movies' && lastBooking" class="mb-10 animate-in fade-in slide-in-from-top duration-700">
        <h2 class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Your Recent Booking</h2>
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center shadow-2xl shadow-blue-900/20">
          <div class="flex items-center gap-4">
            <div class="bg-white/20 p-3 rounded-2xl text-2xl">🎟️</div>
            <div>
              <h3 class="text-xl font-black">{{ lastBooking.title }}</h3>
              <p class="text-blue-100 text-sm font-medium">Seats: {{ lastBooking.seats.join(', ') }}</p>
            </div>
          </div>
          <div class="mt-4 md:mt-0 text-right">
            <p class="text-xs text-blue-200 uppercase font-bold">Total Paid</p>
            <p class="text-2xl font-black text-white">{{ lastBooking.total }} ฿</p>
          </div>
        </div>
      </div>

      <div v-if="step === 'movies'">
        <h2 class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Now Showing</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          <MovieCard v-for="m in movies" :key="m.id" :movie="m" @select="selectMovie" />
        </div>
      </div>

      <div v-else-if="step === 'seats'" class="flex justify-center">
        <SeatPicker :movie="currentMovie" :seats="seats" @booked="onBooked" />
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MovieCard from './components/MovieCard.vue';
import SeatPicker from './components/SeatPicker.vue';

const step = ref('movies');
const movies = ref([]);
const currentMovie = ref(null);
const seats = ref([]);
const lastBooking = ref(null);

// เพิ่ม State สำหรับจัดการ UI สถานะ
const loading = ref(false);
const error = ref(null);

// ฟังก์ชันดึงรายการหนังทั้งหมด
async function fetchMovies() {
  error.value = movies.value = null;
  loading.value = true;
  try {
    const res = await fetch('http://localhost:3000/api/movies');
    if (!res.ok) throw new Error('Failed to fetch movies');
    movies.value = await res.json();
  } catch (err) {
    error.value = err.toString();
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// ฟังก์ชันเลือกหนังและดึงข้อมูลที่นั่ง
const selectMovie = async (movie) => {
  currentMovie.value = movie;
  error.value = seats.value = null;
  loading.value = true;
  
  try {
    const res = await fetch(`http://localhost:3000/api/seats/${movie.id}`);
    if (!res.ok) throw new Error('Error loading seats');
    seats.value = await res.json();
    step.value = 'seats';
  } catch (err) {
    error.value = err.toString();
    alert(error.value);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMovies();
});

const onBooked = (summary) => {
  lastBooking.value = summary;
  step.value = 'movies'; 
};
</script>