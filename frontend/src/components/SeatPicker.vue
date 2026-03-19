<template>
  <div class="bg-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl border border-slate-700">
    <div class="w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent mb-12 shadow-[0_10px_20px_rgba(59,130,246,0.5)]"></div>
    
    <div class="grid grid-cols-5 gap-3 mb-10">
      <button v-for="seat in seats" :key="seat.id" :disabled="seat.isBooked"
        @click="toggle(seat)"
        :class="['h-10 rounded-lg text-xs font-bold transition-all',
          seat.isBooked ? 'bg-slate-700 text-slate-500 cursor-not-allowed' :
          selected.some(s => s.id === seat.id) ? 'bg-yellow-400 text-slate-900 scale-110 shadow-lg shadow-yellow-400/20' : 'bg-slate-600 text-white hover:bg-slate-500']">
        {{ seat.name }}
      </button>
    </div>

    <div class="space-y-4 pt-6 border-t border-slate-700">
      <div class="flex justify-between text-sm">
        <span class="text-slate-400">Selected:</span>
        <span class="font-bold text-yellow-400">{{ selected.map(s => s.name).join(', ') || 'None' }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-2xl font-black text-white">{{ selected.length * movie.price }} ฿</span>
        <button @click="submit" :disabled="selected.length === 0"
          class="bg-yellow-400 text-slate-900 px-8 py-3 rounded-xl font-bold active:scale-95 disabled:opacity-30 transition-all">
          BOOK NOW
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const props = defineProps(['movie', 'seats']);
const emit = defineEmits(['booked']);
const selected = ref([]);
const toggle = (s) => {
  const i = selected.value.findIndex(x => x.id === s.id);
  i > -1 ? selected.value.splice(i, 1) : selected.value.push(s);
};
const submit = async () => {
  const res = await fetch('http://localhost:3000/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movieId: props.movie.id, movieTitle: props.movie.title, seatIds: selected.value.map(s => s.id), seatsNames: selected.value.map(s => s.name) })
  });
  const data = await res.json();
  if (data.success) emit('booked', data.summary);
};
</script>