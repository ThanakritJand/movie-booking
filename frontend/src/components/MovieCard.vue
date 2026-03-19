<template>
  <div @click="$emit('select', movie)" class="group cursor-pointer bg-slate-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-yellow-400 transition-all shadow-lg">
    <div class="relative aspect-[2/3]">
      <img :src="movie.img" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
      <div class="absolute bottom-0 p-3 w-full">
        <h3 class="font-bold text-white text-sm truncate">{{ movie.title }}</h3>
        <p class="text-yellow-400 text-xs font-bold">{{ movie.price }} ฿</p>
      </div>
    </div>
  </div>
</template>
<script setup>defineProps(['movie']);</script>