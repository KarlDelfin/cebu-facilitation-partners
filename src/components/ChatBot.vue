<template>
  <div id="chatbot">
    <button 
      v-if="!isOpen" 
      @click="toggleChat"
      class="!fixed !bottom-6 !right-6 !w-14 !h-14 !bg-[var(--secColor)] !text-white !rounded-full !shadow-2xl !flex !items-center !justify-center !z-[99999] hover:!bg-[#0f5690] !transition-all !duration-200 !cursor-pointer group"
      title="Open Chat Assistant"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="!w-6 !h-6 group-hover:!scale-110 !transition-transform">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.75.75 0 0 1-1.074-.765 6.001 6.001 0 0 1 1.166-3.41C4.426 15.405 4 13.753 4 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    </button>

    <div 
      v-else 
      data-lenis-prevent
      class="!fixed !bottom-6 !right-6 !w-[340px] !h-[480px] !bg-white !rounded-2xl !shadow-2xl !flex !flex-col !overflow-hidden !z-[99999] !font-sans !transition-all !duration-200"
    >
      <div class="!bg-[#136cb3] !p-4 !text-white !flex !justify-between !items-center !border-b-2 !border-[#feb841]">
        <div>
          <div class="!font-bold !text-sm !tracking-wide">Upskills Facilitation Partners</div>
          <div class="!text-[11px] !text-slate-200 !mt-0.5">AI Assistant • Online</div>
        </div>
        <div class="!flex !items-center !gap-2.5">
          <button @click="clearHistory" class="!text-[10px] !text-slate-300 hover:!text-white !mr-1 !transition-colors !cursor-pointer" title="Clear Chat History">Clear</button>
          <span class="!w-2 !h-2 !rounded-full !bg-emerald-400 !animate-pulse"></span>
          
          <button 
            @click="toggleChat" 
            class="!text-white hover:!text-slate-200 !text-lg !font-bold !ml-1 !leading-none !transition-colors !cursor-pointer !p-1" 
            title="Minimize Chat"
          >
            &minus;
          </button>
        </div>
      </div>

      <div class="!flex-1 !p-4 !flex !flex-col !gap-3 !h-[320px] !overflow-y-auto !overflow-x-hidden !scroll-smooth !bg-slate-50 !pointer-events-auto" ref="chatViewport">
        <div v-for="(msg, index) in messages" :key="index" 
             :class="[
               '!p-3 !rounded-xl !max-w-[80%] !text-[12.5px] !line-height-[1.5] !word-break-break-word', 
               msg.sender === 'user' 
                 ? '!bg-[#136cb3] !text-white !self-end !rounded-br-none' 
                 : '!bg-white !text-slate-800 !border !border-slate-200 !self-start !rounded-bl-none'
             ]"
             v-html="msg.text">
        </div>
        
        <div v-if="loading" class="!text-slate-400 !italic !text-xs !self-start !pl-1 !animate-pulse !flex !items-center !gap-1">
          <span class="!w-1.5 !h-1.5 !rounded-full !bg-slate-400"></span>
          Thinking...
        </div>
      </div>

      <div class="!p-3 !border-t !border-slate-100 !bg-white !flex !gap-2 !items-center">
        <el-input 
          v-model="userInput" 
          placeholder="Ask about our training packages..." 
          size="default"
          class="!flex-1"
          @keyup.enter="askBot"
        />
        <el-button 
          type="primary" 
          size="default" 
          :loading="loading" 
          class="!bg-[#136cb3] !border-[#136cb3] !text-white !font-semibold hover:!bg-[#0f5690] hover:!border-[#0f5690]"
          @click="askBot"
        >
          Send
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/utils/supabaseClient';

export default {
  data() {
    return {
      isOpen: false,
      userInput: '',
      loading: false,
      messages: []
    }
  },
 
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.scrollToBottom();
      }
    },
    loadDefaultWelcome() {
      this.messages = [
        { sender: 'bot', text: 'Hello! Welcome to Upskills Facilitation Partners. Ask me anything about our training modules, corporate events, or packages, and I will happily assist you!' }
      ];
      this.saveToLocal();
    },
    saveToLocal() {
      localStorage.setItem('upskills_chat_history', JSON.stringify(this.messages));
    },
    async askBot() {
      if (!this.userInput.trim() || this.loading) return

      const promptText = this.userInput
      this.messages.push({ sender: 'user', text: promptText })
      this.saveToLocal();
      
      this.userInput = ''
      this.loading = true
      this.scrollToBottom();

      try {
        const { data, error } = await supabase.functions.invoke('chat', {
          body: { message: promptText }
        })

        if (error) throw error

        this.messages.push({ sender: 'bot', text: data.reply })
      } catch (err) {
        console.error(err)
        this.messages.push({ sender: 'bot', text: "I'm having trouble connecting to our system right now. Please try asking again shortly." })
      } finally {
        this.loading = false
        this.saveToLocal();
        this.scrollToBottom();
      }
    },
    clearHistory() {
      localStorage.removeItem('upskills_chat_history');
      this.loadDefaultWelcome();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatViewport;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
  },
  mounted() {
    const localHistory = localStorage.getItem('upskills_chat_history');
    
    if (localHistory) {
      try {
        this.messages = JSON.parse(localHistory);
      } catch (e) {
        this.loadDefaultWelcome();
      }
    } else {
      this.loadDefaultWelcome();
    }
    this.scrollToBottom();
  },
}
</script>

<style scoped>
:deep(ul) {
  list-style-type: disc !important;
  margin-left: 16px !important;
  margin-top: 4px !important;
  margin-bottom: 4px !important;
}
:deep(li) {
  margin-bottom: 4px !important;
}
:deep(strong) {
  font-weight: 700 !important;
}
</style>