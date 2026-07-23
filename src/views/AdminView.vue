<template>
  <el-container v-if="$store.getters.getUser" class="h-screen bg-slate-50 text-slate-800">
    <AdminSidebar />

    <el-container class="flex flex-col">
      <el-header class="!flex bg-white border-b border-slate-200 flex justify-end !items-center px-6 h-16">
        
        <div class="flex items-center gap-3 justify-end items-center">
          
          <el-button 
            type="danger" 
            size="small" 
            plain 
            @click="handleSignOut"
          >
            Sign Out
          </el-button>
        </div>
      </el-header>

      <el-main class="p-6 overflow-y-auto bg-slate-50">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>

  <div v-else class="h-screen w-screen flex justify-center items-center bg-slate-100" v-loading="loading">
    <el-card class="w-[420px] p-5 rounded-xl text-center border-none" shadow="always">
      <div class="flex flex-col gap-1 mb-2">
        <h2 class="text-[#136cb3] text-2xl font-extrabold tracking-wide uppercase m-0">
          Cebu Facilitation Partners
        </h2>
        <p class="text-slate-500 text-xs font-medium m-0">
          Admin Gateway
        </p>
      </div>
      
      <el-divider class="my-4" />
      
      <div class="mt-6">
        <el-button 
          type="primary" 
          size="large" 
          class="w-full font-semibold flex items-center justify-center gap-2.5 transition-all duration-200"
          color="#136cb3" 
          @click="handleGoogleLogin"
        >
          <img 
            src="https://authjs.dev/img/providers/google.svg" 
            alt="Google Logo" 
            class="w-[18px] h-[18px] p-[1px] !mr-1" 
          />
          Continue with Google
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import AdminSidebar from '@/components/AdminSidebar.vue';
import { supabase } from '@/utils/supabaseClient';
import { ElMessage } from 'element-plus';

export default {
  name: 'AdminView',
  components: {
    AdminSidebar
  },
  data() {
    return {
      loading: true,
      isValidating: false
    };
  },
  methods: {
    async validateAndSetSession(session) {
      if (!session || !session.user) {
        this.$store.dispatch('setUser', null);
        this.loading = false;
        return;
      }
      
      if (this.isValidating) return; 

      const userEmail = session.user.email;
      this.loading = true;
      this.isValidating = true;

      try {
        const { data, error } = await supabase
          .from('User')
          .select('email')
          .eq('email', userEmail)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          ElMessage.error(`Access Denied: ${userEmail} is not authorized.`);
          this.$store.dispatch('setUser', null);
          await supabase.auth.signOut(); 
          return;
        }

        this.$store.dispatch('setUser', session);
        
        if (this.$route.path === '/admin' || this.$route.path === '/admin/') {
          this.$router.push('/admin/bookings');
        }
      } catch (err) {
        ElMessage.error(`Authorization engine error: ${err.message}`);
        this.$store.dispatch('setUser', null);
        await supabase.auth.signOut();
      } finally {
        this.loading = false;
        this.isValidating = false;
      }
    },

    async handleGoogleLogin() {
      try {
        this.loading = true;
        
        // 1. Calculate base path dynamically
        const baseHref = document.querySelector('base')?.getAttribute('href') || '/cebu-facilitation-partners/';
        const cleanBase = baseHref.endsWith('/') ? baseHref : baseHref + '/';
        
        // 🌟 Target the exact /admin/bookings route!
        const absoluteRedirectUrl = `${window.location.origin}${cleanBase}admin/bookings`;

        // 2. Pass it directly into Supabase OAuth options
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { 
            redirectTo: absoluteRedirectUrl 
          }
        });
        
        if (error) throw error;
      } catch (err) {
        ElMessage.error(`OAuth Initialization failure: ${err.message}`);
        this.loading = false;
      }
    },
    
    async handleSignOut() {
      await supabase.auth.signOut();
      this.$store.dispatch('setUser', null); 
      ElMessage.info('Logged out securely.');
      this.$router.push('/admin');
    },
  }, 
  mounted() {
    supabase.auth.getSession().then(({ data: { session } }) => {
      this.validateAndSetSession(session);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        this.$store.dispatch('setUser', null);
        this.loading = false;
        return;
      }
      this.validateAndSetSession(session);
    });
  },
}
</script>