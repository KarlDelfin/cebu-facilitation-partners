<template>
<div class="booking_form" id="bookingForm">
  <button class="booking_form_close" @click="clear">&times;</button>
 
  <!-- Step indicator -->
  <div class="steps_con">
    <div :class="`step_item ${formStep === 1 ? 'active' : ''}`">
      <div class="step_circle">1</div>
      <div class="step_title">Training Program</div>
      <div class="step_desc">Select the workshop or training service</div>
    </div>
    <div class="step_line"></div>
    <div :class="`step_item ${formStep === 2 ? 'active' : ''}`">
      <div class="step_circle">2</div>
      <div class="step_title">Schedule</div>
      <div class="step_desc">Choose your preferred date and time</div>
    </div>
    <div class="step_line"></div>
    <div :class="`step_item ${formStep === 3 ? 'active' : ''}`">
      <div class="step_circle">3</div>
      <div class="step_title">Organization Details</div>
      <div class="step_desc">Provide your contact and company information</div>
    </div>
  </div>
 
    <!-- STEP 1: SERVICES -->
    <div class="service_panel" v-if="formStep === 1">
        <div class="services_grid">

            <div
                v-for="(service, index) in services"
                :key="index"
                class="service_card"
                :class="{ active: selectedService === service.id }"
                @click="handleSelectService(service.id)"
            >
                <div class="service_header">
                    <h3>{{ service.name }}</h3>
                    <span class="service_price">₱{{ service.price }}</span>
                </div>

                <p class="service_description">
                    {{ service.description }}
                </p>

                <div class="service_footer">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>Select Service</span>
                </div>
            </div>

        </div>

        <div class="form_nav">
            <span></span>
            <button class="btn_next" @click="goToStep(2, 'next')">
                Next
                <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    </div>
 
  <!-- STEP 2: BOOKING TIME -->
  <div class="booking_panel" v-else-if="formStep === 2">
    <div class="field_group">
      <label class="field_label">Preferred Date</label>
      <VCalendar expanded @dayclick="handleSelectDate" :min-date="new Date()" :attributes="vCalendarEvents"/>
    </div>
    <div class="form_nav">
      <button class="btn_back" @click="goToStep(1, 'prev')"><i class="fa-solid fa-arrow-left"></i> Back</button>
      <button class="btn_next" @click="goToStep(3, 'next')">Next <i class="fa-solid fa-arrow-right"></i></button>
    </div>
  </div>
 
  <!-- STEP 3: BOOKING FORM -->
  <div class="form_panel" v-else>
    <el-form ref="bookingFormRef" label-position="top" :model="bookingForm">
      <el-form-item 
        label="Full Name" 
        prop="fullName"
        :rules="[
            { required: true, message: 'Please input email address', trigger: 'blur', },
          ]"
        >
        <el-input v-model="bookingForm.fullName" placeholder="John Doe"/>
      </el-form-item>
      <el-form-item 
          label="Email" 
          prop="email"
          :rules="[
            { required: true, message: 'Please input email address', trigger: 'blur', },
            { pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: 'Please input correct email address', trigger: ['blur', 'change'], },
          ]">
        <el-input v-model="bookingForm.email" placeholder="johndoe@example.com" />
      </el-form-item>
      <el-form-item 
        label="Phone" 
        prop="phone"
        :rules="[
          { required: true, message: 'Please input phone number', trigger: 'blur', },
          { pattern: /^(\+?\d{10,15})$/, message: 'Please input correct phone number', trigger: ['blur', 'change'], },
        ]">
        <el-input v-model="bookingForm.phone" maxlength="11" placeholder="09XXXXXXXXXX" />
      </el-form-item>
      <el-form-item 
        label="No. of Participants"
        prop="noOfParticipants">
        <el-input-number v-model="bookingForm.noOfParticipants" :min="1" :max="25" />
      </el-form-item>
    </el-form>
 
    <div class="form_nav">
      <button class="btn_back" @click="goToStep(2, 'prev')"><i class="fa-solid fa-arrow-left"></i> Back</button>
      <button class="btn_submit" @click="submitBooking">Confirm Booking <i class="fa-solid fa-check"></i></button>
    </div>
  </div>
</div>

</template>

<script>
import { supabase } from '@/utils/supabaseClient';
import { ElMessage } from 'element-plus';
import gsap from 'gsap/all'
import moment from 'moment'
export default {
    data(){
      return{
        selectedService: '',
        services: [],
        formStep: 1,
        bookingForm: {
            serviceId: '',
            clientId: '',
            bookingDate: '',
            bookingTime: '',
            status: 'confirmed',
            fullName: '',
            email: '',
            phone: '',
            noOfParticipants: 1,
        },
        vCalendarEvents: [],
      }
    },
    methods: { 
      /* PREV/NEXT CONTROLLER */
      goToStep(step, action) {
        if (action === 'prev') {
          this.formStep = step
          return
        }

        if (!this.bookingForm.serviceId && this.formStep === 1) {
          ElMessage.warning('Please select service')
          return
        }

        if (!this.bookingForm.bookingDate && this.formStep === 2) {
          ElMessage.warning('Please select preferred date')
          return
        }

        this.formStep = step
      },

      
      /* HANDLE SELECT SERVICE */
      handleSelectService(serviceId){
          this.selectedService = serviceId
          this.bookingForm.serviceId = serviceId
      },

      /* HANDLE SELECT DATE */
      handleSelectDate(day){
        if (moment(new Date()).startOf('day') > moment(day.date).startOf('day')) {
          ElMessage.warning('Cannot select past date')
          return
        }
        this.bookingForm.bookingDate = moment(day.date).format('YYYY-MM-DD')
        this.vCalendarEvents = []
        this.vCalendarEvents.push({
          highlight: {
            backgroundColor: '#ff8080',
          },
          dates: new Date(day.date),
        })
      },
      
      /* SUBMIT BOOKING */
      async submitBooking(){
        try {
          const isValid = this.$refs.bookingFormRef.validate()
          if(!isValid) return
          

        } catch (e) {
          console.error(e)
        }
      },

      /* GET SERVICES */
      async getServices(){
          try{
              const {data, e} = await supabase
                  .from('Service')
                  .select('*')
              if(e) return e

              this.services = data
          }
          catch(e) {
              console.error(e)
          }
      },

      clear(){
          this.bookingForm.serviceId = ''
          this.bookingForm.clientId = ''
          this.bookingForm.bookingDate = ''
          this.bookingForm.bookingTime = ''
          this.bookingForm.status = 'confirmed'
          this.bookingForm.fullName = ''
          this.bookingForm.email = ''
          this.bookingForm.phone = ''
          this.bookingForm.noOfParticipants = 1
          this.selectedService = ''
          this.formStep = 1
          this.vCalendarEvents = []
          
          gsap.to('#bookingForm', {
              opacity: 0,
              y: 300,
              visibility: 'hidden',
              duration: .5
              
          })
      },
    },

    async mounted() {
        await this.getServices()
        console.log(this.formStep)
    }
}
</script>


<style>
.booking_form {position: fixed; background: var(--defaultColor); width: 100%; max-width: 900px; border-radius: 12px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,.35); bottom: 30px; left: 0; right: 0; margin: 0 auto; opacity: 0; visibility: hidden; z-index: 1;}
.booking_form_close {position:absolute; top:16px; right:20px; font-size:1.4rem; color:var(--bodyColor); cursor:pointer; background:none; border:none;}

.steps_con {display:flex; align-items:center; justify-content:center; gap:0; margin-bottom:40px;}
.step_item {display:flex; flex-direction:column; align-items:center; text-align:center; width:220px;}
.step_circle {width:36px; height:36px; border-radius:50%; border:2px solid var(--bodyColor); color:var(--bodyColor); display:flex; align-items:center; justify-content:center; font-weight:700; margin-bottom:10px; background:var(--defaultColor);}
.step_item.active .step_circle, .step_item.completed .step_circle {border-color:var(--priColor); color:var(--priColor);}
.step_item.active .step_title {color:var(--priColor);}
.step_title {font-weight:700; color:var(--bodyColor); font-size:.95rem;}
.step_desc {font-size:.8rem; color:#888; margin-top:4px;}

.step_line {flex:1; height:2px; background:var(--bodyColor); margin-top:-24px; max-width:120px;}
.step_line.completed {background:var(--priColor);}

.services_grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 20px; }

.service_card { background: #fff; border: 2px solid #e8eef7; border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.3s ease; position: relative; }
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

.form_nav {display:flex; justify-content:space-between; align-items:center; margin-top:30px; border-top:1px solid #eee; padding-top:24px;}
.btn_back, .btn_next, .btn_submit {padding:12px 28px; border-radius:8px; font-weight:700; cursor:pointer; border:none; font-size:.95rem;}
.btn_back {background:var(--defaultColor); color:var(--bodyColor); border:1px solid #ddd;}
.btn_next, .btn_submit {background:var(--priColor); color:var(--defaultColor);}
.btn_next i, .btn_submit i {margin-left:8px;}
.btn_back i {margin-right:8px;}


@media(max-width:1000px) {

.booking_form {max-width:90%;}

}


@media(max-width:800px) {

.service_card {flex:1 1 calc(50% - 10px);}

.step_title {font-size:.8rem;}

.step_desc {display:none;}

}


@media(max-width:600px) {

.booking_form {padding:24px;}

.service_card {flex:1 1 100%;}

.steps_con {gap:0;}

.step_line {max-width:30px;}


.form_nav {flex-direction:column; gap:12px;}

.btn_back, .btn_next, .btn_submit {width:100%; text-align:center;}

}
</style>