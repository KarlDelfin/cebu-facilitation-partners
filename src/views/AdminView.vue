<template>
  <el-container v-if="session" class="dashboard-container">
    <AdminSidebar />

    <el-container>
      <el-header class="dashboard-header">
        <div class="header-title">Dashboard</div>
        <div class="header-right-controls">
          <el-button 
            type="danger" 
            size="small" 
            plain 
            style="margin-left: 12px;" 
            @click="handleSignOut"
          >
            Sign Out
          </el-button>
        </div>
      </el-header>

      <el-main class="dashboard-main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>

  <div v-else class="login-overlay" v-loading="loading">
    <el-card class="login-card" shadow="always">
      <div class="login-brand">
        <h2>Upskills Partners</h2>
        <p>Internal Operations Management Gateway</p>
      </div>
      <el-divider />
      <div class="login-action">
        <el-button 
          type="primary" 
          size="large" 
          class="google-btn"
          color="#136cb3" 
          @click="handleGoogleLogin"
        >
          <img src="https://authjs.dev/img/providers/google.svg" alt="Google Logo" class="google-icon" />
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
      session: null,
      loading: true,
      isValidating: false
    };
  },

  methods: {
    async validateAndSetSession(session) {
      if (!session || !session.user) {
        this.session = null;
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
          this.session = null;
          await supabase.auth.signOut(); 
          return;
        }

        this.session = session;
        if (session && (this.$route.path === '/admin' || this.$route.path === '/admin/')) {
          this.$router.push('/admin/bookings');
        }
      } catch (err) {
        ElMessage.error(`Authorization engine error: ${err.message}`);
        this.session = null;
        await supabase.auth.signOut();
      } finally {
        this.loading = false;
        this.isValidating = false;
      }
    },
    async handleGoogleLogin() {
      try {
        this.loading = true;
        const baseHref = document.querySelector('base')?.getAttribute('href') || '/cebu-facilitation-partners/';
        const cleanBase = baseHref.endsWith('/') ? baseHref : baseHref + '/';
        const absoluteRedirectUrl = `${window.location.origin}${cleanBase}admin`;

        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: absoluteRedirectUrl }
        });
        if (error) throw error;
      } catch (err) {
        ElMessage.error(`OAuth Initialization failure: ${err.message}`);
        this.loading = false;
      }
    },
    async handleSignOut() {
      await supabase.auth.signOut();
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
        this.session = null;
        this.loading = false;
        return;
      }
      this.validateAndSetSession(session);
    });
  },
}
</script>

<style scoped>
.dashboard-container {
  --priColor: #136cb3;
  --secColor: #feb841;
  --thiColor: #fff;
  --defaultColor: #fff;
  --bodyColor: #333;

  height: 100vh;
  background-color: #f8fafc;
  color: var(--bodyColor);
}

.dashboard-header {
  background-color: var(--defaultColor);
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--bodyColor);
}

.header-right-controls {
  display: flex;
  align-items: center;
}

.location-badge {
  background-color: #f1f5f9;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--priColor);
  border: 1px solid #cbd5e1;
}

.dashboard-main {
  padding: 24px;
  overflow-y: auto;
}

/* 🔒 Portal Lock Overlay Styles */
.login-overlay {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f5f9;
}

.login-card {
  width: 420px;
  padding: 20px 10px;
  border-radius: 12px;
  text-align: center;
}

.login-brand h2 {
  color: #136cb3;
  margin: 0 0 4px 0;
  font-weight: 800;
  text-transform: uppercase;
}

.login-brand p {
  color: #64748b;
  font-size: 0.85rem;
  margin: 0;
}

.login-action {
  margin-top: 24px;
}

.google-btn {
  width: 100%;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.google-icon {
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 2px;
  padding: 1px;
  margin-right: 5px
}

</style>
