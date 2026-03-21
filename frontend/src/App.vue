<template>
  <div id="app" class="p-8 font-sans max-w-5xl mx-auto bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-black text-center mb-10 text-slate-800">🎬 MOVIE BOOKING</h1>

    <div v-if="!selectedMovie" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="m in movies" :key="m.id" class="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 p-4">
        <img :src="m.img" class="w-full h-56 object-cover rounded-xl shadow-inner">
        <h2 class="text-xl font-bold mt-4 text-slate-800">{{ m.title }}</h2>
        <p class="text-blue-600 font-bold text-lg leading-none mt-2">{{ m.price }} บาท</p>
        <button @click="loadSeats(m)" class="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
          จองที่นั่งเรื่องนี้
        </button>
      </div>
    </div>

    <div v-if="selectedMovie" class="max-w-2xl mx-auto">
      <button @click="selectedMovie = null" class="mb-4 text-slate-500 hover:text-slate-800 font-bold flex items-center">
        ⬅ ย้อนกลับไปเลือกหนัง
      </button>

      <div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h2 class="text-2xl font-black text-slate-800 mb-2">{{ selectedMovie.title }}</h2>
        <p class="text-slate-400 text-sm mb-8 italic">เลือกที่นั่งที่คุณต้องการ</p>

        <div class="grid grid-cols-5 gap-3 mb-10">
          <button 
            v-for="s in seats" 
            :key="s.id"
            @click="toggleSeat(s)"
            :disabled="s.isBooked"
            :class="[
              'h-12 rounded-xl border-2 font-bold transition-all duration-200',
              s.isBooked ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed' : 
              mySelection.includes(s.id) ? 'bg-green-500 border-green-600 text-white shadow-lg scale-105' : 
              'bg-white border-slate-100 text-slate-600 hover:border-blue-300'
            ]"
          >
            {{ s.name }}
          </button>
        </div>

        <div v-if="mySelection.length > 0" class="bg-slate-900 text-white p-6 rounded-2xl shadow-2xl relative overflow-hidden">
          <div class="relative z-10">
            <p class="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-1">Preview Confirmation</p>
            <div class="flex justify-between items-end">
              <div>
                <p class="text-xl font-bold italic">{{ selectedMovie.title }}</p>
                <p class="text-sm text-blue-400 font-mono mt-1">SEATS: {{ getSeatNames() }}</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-black text-green-400 leading-none">{{ mySelection.length * selectedMovie.price }} ฿</p>
              </div>
            </div>
            <button @click="confirmBooking" class="w-full mt-6 bg-white text-slate-900 font-black py-4 rounded-xl hover:bg-blue-400 transition-colors">
              ยืนยันการจองตั๋ว
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  // ใน Vite ต้อง import แบบนี้ครับ
  import { ref, onMounted } from 'vue';

  // --- Data ---
  const movies = ref([]);
  const selectedMovie = ref(null);
  const seats = ref([]);
  const mySelection = ref([]);

  // --- Logic (Async Functions) ---
  
  async function fetchMovies() {
    try {
      const res = await fetch('http://localhost:3000/api/movies');
      movies.value = await res.json();
    } catch (err) { console.error(err); }
  }

  async function loadSeats(movie) {
    try {
      const res = await fetch(`http://localhost:3000/api/seats/${movie.id}`);
      seats.value = await res.json();
      selectedMovie.value = movie;
      mySelection.value = []; 
    } catch (err) { console.error(err); }
  }

  async function confirmBooking() {
    try {
      const payload = {
        movieId: selectedMovie.value.id,
        movieTitle: selectedMovie.value.title,
        seatIds: mySelection.value,
        seatsNames: getSeatNames().split(', ')
      };

      const res = await fetch('http://localhost:3000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        alert(`จองสำเร็จ! ยอดรวม: ${data.summary.total} บาท`);
        selectedMovie.value = null;
        fetchMovies(); 
      }
    } catch (err) { alert("Error!"); }
  }

  function toggleSeat(seat) {
    const index = mySelection.value.indexOf(seat.id);
    if (index > -1) mySelection.value.splice(index, 1);
    else mySelection.value.push(seat.id);
  }

  function getSeatNames() {
    return seats.value
      .filter(s => mySelection.value.includes(s.id))
      .map(s => s.name).join(', ');
  }

  onMounted(fetchMovies);
</script>
