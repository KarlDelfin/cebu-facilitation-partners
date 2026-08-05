<template>
  <div data-lenis-prevent id="bookingForm" v-loading="loading" class="booking_form">
    <!-- Close Button -->
    <button class="booking_form_close" aria-label="Close form" @click="clear">
      &times;
    </button>

    <div class="booking_form_wrapper">
      <!-- Dynamic Step Indicator -->
      <div class="steps_con">
        <template v-for="(step, index) in steps" :key="step.number">
          <div 
            class="step_item" 
            :class="{ 
              active: formStep === step.number, 
              completed: formStep > step.number 
            }"
          >
            <div class="step_circle">
              {{ step.number }}
            </div>
            <div class="step_title">
              {{ step.title }}
            </div>
            <div class="step_desc">
              {{ step.desc }}
            </div>
          </div>

          <!-- Connector Line -->
          <div 
            v-if="index < steps.length - 1" 
            class="step_line"
            :class="{ completed: formStep > step.number }"
          ></div>
        </template>
      </div>

      <!-- Main Content Panel Wrapper -->
      <div>
        <!-- STEP 1: SERVICES -->
        <div v-if="formStep === 1" class="service_panel">
          <div class="services_grid">
            <div
              v-for="service in services"
              :key="service.id"
              class="service_card"
              :class="{ active: bookingForm.serviceId === service.id }"
              @click="handleSelectService(service.id)"
            >
              <div class="service_header">
                <h3>{{ service.name }}</h3>
              </div>
              <p class="service_description">{{ service.description }}</p>
              <div class="service_footer">
                <i class="fa-solid fa-circle-check"></i>
                <span>{{ bookingForm.serviceId === service.id ? 'Selected' : 'Select Service' }}</span>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="form_nav">
            <span></span>
            <button class="btn_next" @click="goToStep(2, 'next')">
              Next <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- STEP 2: BOOKING TIME -->
        <div v-else-if="formStep === 2" class="service_panel">
          <div>
            <label class="field_label">Preferred Date</label>
            <VCalendar
              expanded
              :min-date="new Date()"
              :attributes="vCalendarEvents"
              @dayclick="handleSelectDate"
            />
          </div>

          <div style="margin-top: 20px;">
            <label class="field_label">Preferred Time</label>
            <div class="time_buttons">
              <button
                v-for="slot in timeSlots"
                :key="slot.id"
                type="button"
                class="time_btn"
                :class="{
                  active: bookingForm.timeSlotId === slot.id,
                  disabled: slot.disabled
                }"
                :disabled="slot.disabled"
                @click="!slot.disabled && handleSelectTime(slot.id)"
              >
                {{ slot.formattedTime }}
              </button>
            </div>
          </div>

          <!-- Navigation -->
          <div class="form_nav">
            <button class="btn_back" @click="goToStep(1, 'back')">
              <i class="fa-solid fa-arrow-left"></i> Back
            </button>
            <button class="btn_next" @click="goToStep(3, 'next')">
              Next <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- STEP 3: BOOKING FORM -->
        <div v-else class="form_panel">
          <el-form ref="bookingFormRef" label-position="top" :model="bookingForm" :rules="formRules">
            <el-form-item label="Full Name" prop="fullName">
              <el-input v-model="bookingForm.fullName" placeholder="John Doe" size="large" />
            </el-form-item>

            <el-form-item label="Email" prop="email">
              <el-input v-model="bookingForm.email" placeholder="johndoe@example.com" size="large" />
            </el-form-item>

            <el-form-item label="Phone" prop="phone">
              <el-input v-model="bookingForm.phone" maxlength="11" placeholder="09XXXXXXXXXX" size="large" />
            </el-form-item>

            <!-- <el-form-item label="Number of Participants" prop="noOfParticipants">
              <el-input-number v-model="bookingForm.noOfParticipants" :min="1" style="width: 100%" size="large" placeholder="Enter number" />
            </el-form-item> -->

            <el-form-item >
              <VueHcaptcha
                ref="hcaptchaRef"
                :sitekey="sitekey"
                size="normal"
                @verify="onVerify"
                @expired="onExpired"
              />
            </el-form-item>
          </el-form>

          <!-- Navigation -->
          <div class="form_nav">
            <button class="btn_back" @click="goToStep(2, 'back')">
              <i class="fa-solid fa-arrow-left"></i> Back
            </button>
            <button class="btn_submit" :disabled="loading" @click="submitBooking">
              Confirm Booking <i class="fa-solid fa-check"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import { supabase } from '@/utils/supabaseClient';
import { ElMessage } from 'element-plus';
import gsap from 'gsap';
import moment from 'moment';

export default {
  name: 'BookingFormComponent',
  components: {
    VueHcaptcha
  },
  data() {
    return {
      sitekey: import.meta.env.VITE_HCAPTCHA_SITE_KEY,
      loading: false,
      formStep: 1,
      captchaToken: null,
      services: [],
      statuses: [],
      timeSlots: [],
      vCalendarEvents: [],
      steps: [
        { number: 1, title: 'Training Program', desc: 'Select the workshop or training service' },
        { number: 2, title: 'Schedule', desc: 'Choose your preferred date and time' },
        { number: 3, title: 'Organization Details', desc: 'Provide your contact and company information' }
      ],
      bookingForm: {
        serviceId: '',
        bookingDate: '',
        timeSlotId: '',
        statusId: '',
        fullName: '',
        email: '',
        phone: '',
        noOfParticipants: 1
      },
      formRules: {
        fullName: [{ required: true, message: 'Please input full name', trigger: 'blur' }],
        email: [
          { required: true, message: 'Please input email address', trigger: 'blur' },
          {
            pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            message: 'Please input a valid email address',
            trigger: ['blur', 'change']
          }
        ],
        phone: [
          { required: true, message: 'Please input phone number', trigger: 'blur' },
          {
            pattern: /^09\d{9}$/,
            message: 'Must be a valid PH mobile number starting with 09',
            trigger: ['blur', 'change']
          }
        ],
        noOfParticipants: [{ required: true, message: 'Please input number of participants', trigger: 'blur' }]
      }
    };
  },
  async mounted() {
    await Promise.all([
      this.getServices(),
      this.getStatuses(),
      this.getTimeSlots()
    ]);
  },
  methods: {
    onVerify(token) {
      this.captchaToken = token;
    },
    onExpired() {
      this.captchaToken = null;
    },

    // Get Statuses
    async getStatuses() {
      try {
        const { data, error } = await supabase.from('Status').select('*');
        if (error) throw error;
        this.statuses = data || [];
        
        const pendingStatus = this.statuses.find(s => s.name?.toLowerCase() === 'pending');
        if (pendingStatus) {
          this.bookingForm.statusId = pendingStatus.id;
        }
      } catch (err) {
        console.error('Error fetching statuses:', err);
      }
    },

    // Get Time Slots
    async getTimeSlots() {
      try {
        const { data, error } = await supabase
          .from('TimeSlot')
          .select('*')
          .eq('isActive', true)
          .order('slotTime', { ascending: true });

        if (error) throw error;

        this.timeSlots = (data || []).map(slot => ({
          ...slot,
          formattedTime: moment(slot.slotTime, 'HH:mm:ss').format('h:mm A'),
          disabled: false
        }));
      } catch (err) {
        console.error('Error fetching time slots:', err);
      }
    },

    // Service Data Fetch
    async getServices() {
      try {
        this.loading = true;
        const { data, error } = await supabase
          .from('Service')
          .select('*')
          .order('dateTimeCreated', { ascending: false });

        if (error) throw error;
        this.services = data || [];
      } catch (err) {
        console.error('Error fetching services:', err);
        ElMessage.error('Failed to load training services.');
      } finally {
        this.loading = false;
      }
    },

    // Navigation Steps
    goToStep(step, action) {
      if (action === 'back') {
        this.formStep = step;
        return;
      }

      if (this.formStep === 1 && !this.bookingForm.serviceId) {
        ElMessage.warning('Please select a service.');
        return;
      }

      if (this.formStep === 2) {
        if (!this.bookingForm.bookingDate) {
          ElMessage.warning('Please select a preferred date.');
          return;
        }
        if (!this.bookingForm.timeSlotId) {
          ElMessage.warning('Please select a preferred time slot.');
          return;
        }
      }

      this.formStep = step;
    },

    // Event Handlers
    handleSelectService(serviceId) {
      this.bookingForm.serviceId = serviceId;
    },

    async handleSelectDate(day) {
      this.bookingForm.bookingDate = '';
      this.bookingForm.timeSlotId = '';

      const today = moment().startOf('day');
      const targetDate = moment(day.date).startOf('day');

      if (targetDate < today) {
        ElMessage.warning('Cannot select a past date.');
        return;
      }

      this.bookingForm.bookingDate = targetDate.toISOString();

      this.vCalendarEvents = [
        {
          highlight: { backgroundColor: 'var(--priColor, #3b82f6)' },
          dates: new Date(day.date)
        }
      ];

      try {
        const startOfDay = targetDate.format('YYYY-MM-DD 00:00:00');
        const endOfDay = targetDate.format('YYYY-MM-DD 23:59:59');

        const { data, error } = await supabase
          .from('Booking')
          .select('timeSlotId')
          .gte('bookingDate', startOfDay)
          .lte('bookingDate', endOfDay);

        if (error) throw error;

        const bookedTimeSlotIds = new Set((data || []).map(item => item.timeSlotId));

        this.timeSlots = this.timeSlots.map(slot => ({
          ...slot,
          disabled: bookedTimeSlotIds.has(slot.id)
        }));
      } catch (err) {
        console.error('Error fetching booked slots:', err);
      }
    },

    handleSelectTime(timeSlotId) {
      this.bookingForm.timeSlotId = timeSlotId;
    },

    // Form Submission
    async submitBooking() {
      try {
        if (!this.$refs.bookingFormRef) return;
        await this.$refs.bookingFormRef.validate();

        if (!this.captchaToken) {
          ElMessage.warning('Please check the security box before submitting.');
          return;
        }

        if (!this.bookingForm.statusId) {
          const pendingStatus = this.statuses.find(s => s.name?.toLowerCase() === 'pending');
          if (pendingStatus) this.bookingForm.statusId = pendingStatus.id;
        }

        this.loading = true;

        const payload = {
          serviceId: this.bookingForm.serviceId,
          statusId: this.bookingForm.statusId,
          bookingDate: this.bookingForm.bookingDate,
          timeSlotId: this.bookingForm.timeSlotId,
          fullName: this.bookingForm.fullName,
          email: this.bookingForm.email,
          phone: this.bookingForm.phone,
          noOfParticipants: this.bookingForm.noOfParticipants
        };

        const { error } = await supabase.from('Booking').insert(payload);
        if (error) throw error;

        try {
          await supabase.functions.invoke('send-booking-email', {
            body: {
              clientName: payload.fullName,
              clientEmail: payload.email,
              clientPhone: payload.phone,
              bookingDate: payload.bookingDate,
              timeSlotId: payload.timeSlotId,
              noOfParticipants: payload.noOfParticipants
            }
          });
        } catch (emailErr) {
          console.error('Database saved, but email trigger failed:', emailErr);
        }

        ElMessage.success('Booking submitted successfully.');
        this.clear();
      } catch (err) {
        console.error('Booking submission error:', err);
      } finally {
        this.loading = false;
      }
    },

    // Form Reset
    clear() {
      const pendingStatus = this.statuses.find(s => s.name?.toLowerCase() === 'pending');

      Object.assign(this.bookingForm, {
        serviceId: '',
        bookingDate: '',
        timeSlotId: '',
        statusId: pendingStatus ? pendingStatus.id : '',
        fullName: '',
        email: '',
        phone: '',
        noOfParticipants: 1
      });

      this.vCalendarEvents = [];
      this.timeSlots = this.timeSlots.map(s => ({ ...s, disabled: false }));

      setTimeout(() => {
        this.formStep = 1;
      }, 500);

      gsap.to('#bookingForm', {
        opacity: 0,
        y: window.innerHeight,
        duration: 0.5,
        ease: 'back.in'
      });
    }
  }
};
</script>

<style scoped>
.booking_form {position: fixed; background: var(--defaultColor); width: 100%; max-width: 900px; border-radius: 12px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,.35); bottom: 30px; left: 0; right: 0; margin: 0 auto; opacity: 0; visibility: hidden; z-index: 1;}
.booking_form_close {position:absolute; top:16px; right:20px; font-size:1.4rem; color:var(--bodyColor); cursor:pointer; background:none; border:none;}
.booking_form_wrapper { max-height: 50vh; overflow-y: auto; overflow-x: hidden; width: 100%;}
.steps_con {display:flex; align-items:center; justify-content:center; gap:0; margin-bottom:40px;}
.step_item {display:flex; flex-direction:column; align-items:center; text-align:center; width:220px;}
.step_circle {width:36px; height:36px; border-radius:50%; border:2px solid var(--bodyColor); color:var(--bodyColor); display:flex; align-items:center; justify-content:center; font-weight:700; margin-bottom:10px; background:var(--defaultColor);}
.step_item.active .step_circle, .step_item.completed .step_circle {border-color:var(--priColor); color:var(--priColor);}
.step_item.active .step_title {color:var(--priColor);}
.step_title {font-weight:700; color:var(--bodyColor); font-size:.95rem;}
.step_desc {font-size:.8rem; color:#888; margin-top:4px;}

.step_line {flex:1; height:2px; background:var(--bodyColor); margin-top:-24px; max-width:120px;}
.step_line.completed {background:var(--priColor);}

.services_grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 20px; }

.service_panel { padding: 0 10px; }
.service_card { background: #fff; border: 2px solid #e8eef7; border-radius: 16px; padding: 15px; cursor: pointer; transition: all 0.3s ease; position: relative; }
.service_card:hover { transform: translateY(-5px); border-color: #2e85e5; box-shadow: 0 10px 30px rgba(46, 133, 229, 0.15); }
.service_card.active { border-color: #2e85e5; background: linear-gradient( 180deg, rgba(46, 133, 229, 0.05), #fff ); box-shadow: 0 10px 30px rgba(46, 133, 229, 0.2); }
.service_card.active::after { content: "✓"; position: absolute; top: -12px; right: -10px; width: 28px; height: 28px; background: #2e85e5; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; }

.service_header { display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; margin-bottom: 12px; }
.service_header h3 { margin: 0; font-size: 1.2rem; color: #222; }

.service_price { background: #2e85e5; color: #fff; padding: 6px 12px; border-radius: 30px; font-weight: 600; white-space: nowrap; }

.service_description { color: #666; line-height: 1.6; margin-bottom: 20px; }

.service_footer { display: flex; align-items: center; gap: 8px; color: #2e85e5; font-weight: 600; }
.service_footer i { font-size: 18px; }

.form_panel form {display: grid; grid-template-columns: repeat(2,1fr); gap: 0 1rem}
.field_label {display:block; font-weight:700; color:var(--bodyColor); margin-bottom:8px; font-size:.9rem;}

.time_buttons { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 5px; }
.time_btn { padding: 8px 16px; border: 1px solid #ccc; border-radius: 5px; background: #f9f9f9; cursor: pointer; transition: 0.2s;width: 19%; }
.time_btn.active { background: var(--priColor); color: #fff; }
.time_btn.active:hover {background: var(--secColor); }
.time_btn:hover { background: #e9e9e9; }
.time_btn.disabled { color: #7f8c8d; opacity: 0.6; cursor: not-allowed; background-color: #ccc; }

.form_nav {display:flex; justify-content:space-between; align-items:center; margin-top:30px; border-top:1px solid #eee; padding-top:24px;}
.form_nav button:hover { background:var(--secColor); transition:all .3s ease; color:var(--defaultColor);}
.btn_back, .btn_next, .btn_submit {padding:12px 28px; border-radius:8px; font-weight:700; cursor:pointer; border:none; font-size:.95rem;}
.btn_back {background:var(--defaultColor); color:var(--bodyColor); border:1px solid #ddd;}
.btn_next, .btn_submit {background:var(--priColor); color:var(--defaultColor);}
.btn_next i, .btn_submit i {margin-left:8px;}
.btn_back i {margin-right:8px;}

@media(max-width:1000px) {
  .booking_form {max-width:95%;}
}

@media(max-width:800px) {
  .service_card {flex:1 1 calc(50% - 10px);}
  .step_title {font-size:.8rem;}
  .step_desc {display:none;}
  .time_btn {width: 48%;}
}

@media(max-width:600px) {
  .form_panel form {grid-template-columns: 1fr}
  .booking_form {padding:24px;}
  .service_card {flex:1 1 100%;}
  .steps_con {gap:0;}
  .step_line {max-width:30px;}
  .form_nav {flex-direction:column; gap:12px;}
  .btn_back, .btn_next, .btn_submit {width:100%; text-align:center;}
}
</style>