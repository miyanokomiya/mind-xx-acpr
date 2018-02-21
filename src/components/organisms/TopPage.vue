<template>
<div style="width: 100%;">
    <section>
      <img :src="Image" style="width: 100%; height: auto; max-width: 600px;" />
    </section>
    <section>
      <v-layout
        column
        align-center
        justify-center
        class="white--text"
      >
        <router-link :to="{name: 'WorkSpace'}" style="margin: 16px 0 24px 0; text-decoration: none;">
          <v-btn
            class="blue lighten-2"
            dark
            large
          >
            Get Started
          </v-btn>
        </router-link>
      </v-layout>
    </section>
</div>
</template>

<script>
import Image from '@/assets/images/demo1.gif'

export default {
  computed: {
    Image: () => Image
  }
}
</script>

<style lang="scss" scoped>
.display-1 {
  background-color: rgba(0,0,0,0.3);
  padding: 6px 12px;
  border-radius: 2px;
}
</style>

