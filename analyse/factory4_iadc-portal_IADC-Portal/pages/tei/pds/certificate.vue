<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import html2pdf from 'html2pdf.js';
import Qrious from 'qrious';
// import QRCode from '~/components/QrCode.vue'
// import QRCodeVue from 'qrcode.vue'
// import VueQrcode from 'vue-qrcode'

@Component({
  layout: 'tei',
  components: {
    // VueQrcode,
    // QRCode,
  },
})
export default class Certificate extends Vue {
  // --------------- //
  // Data            //
  // --------------- //
  userId = 0;
  userSite = '';
  userDepartment = '';
  userCountry = '';
  userEmail = '';
  userName = '';
  trainingCertificate = '';
  urlVerifyCertificate = '';
  trainingTitle = '';
  trainingVersion = '';
  qrious = null;

  // --------------- //
  // Lifecycle hooks //
  // --------------- //
  async mounted() {
    this.getUserData();
    await this.getCertificate();
    this.urlVerifyCertificate = this.buildUrlCertificate();
    // const element = this.$refs.qrcode
    this.qrious = new Qrious({
      element: document.getElementById('qrcode'),
      level: 'Q',
      size: 150,
      value: this.urlVerifyCertificate,
    });
    this.trainingTitle = this.$route.query.msgTitle as '';
    this.trainingVersion = this.$route.query.msgVersion as '';
  }

  // --------------- //
  // Methods         //
  // --------------- //

  // Get the current loged user data to display in the diploma
  private getUserData() {
    if (this.$auth.$state.loggedIn) {
      const user = this.$auth.$state.user;
      this.userSite = user.address;
      this.userId = JSON.parse(user.identities)[0].userId;
      this.userCountry = user.locale;
      this.userEmail = user.email;
      this.userName = `${user.given_name} ${user.family_name}`;
      this.userDepartment = user.zoneinfo;
    }
  }

  // Get the hash of the certificate for the current user
  private async getCertificate() {
    try {
      const { data } = await this.$axios.get(
        `${window.location.origin}/api/certificate/generate`,
        {
          params: {
            userId: this.userId,
            userEmail: this.userEmail,
          },
        },
      );
      this.trainingCertificate = data.certificate;
    } catch (err: any) {
      this.$nuxt.error({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  // Build the URL to verify the certificate and print in the QR code
  private buildUrlCertificate(): string {
    return `${window.location.origin}/api/certificate/verify/${this.trainingCertificate}?userId=${this.userId}&userEmail=${this.userEmail}`;
  }

  // Export the diploma in PDF format
  public exportToPDF() {
    html2pdf()
      .from(this.$refs.certificate)
      .set({
        margin: [1, 1.5, 1, 1],
        filename: 'jira-certificate.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { dpi: 192, letterRendering: true },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' },
      })
      .save();
  }

  // --------------- //
  // Head method     //
  // --------------- //
  head() {
    return { title: 'Central Jira Certificate' };
  }
}
</script>

<template>
  <v-container>
    <h2 class="text-center">Your Central Jira training certificate is ready</h2>
    <br />
    <div ref="certificate" class="d-flex justify-center my-2">
      <div class="pm-certificate-container">
        <div class="outer-border" />
        <div class="inner-border" />
        <div class="pm-certificate-border">
          <div class="pm-certificate-title cursive">
            <h2>Central Jira Certificate of Completion</h2>
            <h3 class="ruda">
              {{ trainingTitle }}
            </h3>
            <img
              class="logo"
              width="200"
              src="@/pages/tei/assets/images/digital-learning.png"
            />
            <img
              class="logo"
              width="100"
              src="@/pages/tei/assets/images/pds-logo.png"
            />
          </div>
          <br />
          <div class="pm-certificate-block ruda">
            <h1>{{ userName }}</h1>
            <h3>{{ userId }} • {{ userEmail }}</h3>
            <!-- Display the QR Code -->
            <canvas id="qrcode" />
            <p class="date">
              {{ new Date() }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <v-card class="px-5 my-10 ml-auto mr-auto" max-width="500px">
      <v-card-title class="d-flex justify-center">
        Download your Certificate
      </v-card-title>

      <v-card-text class="text--primary mt-2">
        This certificate is generated automatically and ready to print.
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" class="ml-auto" @click="exportToPDF">
          Print
        </v-btn>
      </v-card-actions>
    </v-card>

    <br />
  </v-container>
</template>

<style lang="scss" scoped>
.search__field {
  width: 20%;
}

@import url('https://fonts.googleapis.com/css?family=Ruda|Rochester');

.cursive {
  font-family: 'Rochester', cursive;
}

.ruda {
  font-family: 'Ruda', sans-serif;
}

.date {
  font-family: 'Ruda', sans-serif;
  font-size: 10px;
}

#qrcode {
  width: 125px;
}

.pm-certificate-container {
  position: relative;
  width: 800px;
  height: 600px;
  background-color: #618597;
  padding: 30px;
  color: #333;
  font-family: 'Open Sans', sans-serif;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

  .outer-border {
    width: 794px;
    height: 594px;
    position: absolute;
    left: 50%;
    margin-left: -397px;
    top: 50%;
    margin-top: -297px;
    border: 2px solid #fff;
  }

  .inner-border {
    width: 730px;
    height: 530px;
    position: absolute;
    left: 50%;
    margin-left: -365px;
    top: 50%;
    margin-top: -265px;
    border: 2px solid #fff;
  }

  .pm-certificate-border {
    position: relative;
    width: 720px;
    height: 520px;
    padding: 0;
    border: 1px solid #e1e5f0;
    background-color: rgba(255, 255, 255, 1);
    background-image: none;
    left: 50%;
    margin-left: -360px;
    top: 50%;
    margin-top: -260px;

    .pm-certificate-block {
      width: 650px;
      height: 200px;
      position: relative;
      left: 0%;
      margin-left: -325px;
      top: 70px;
      margin-top: 0;
      margin: 0 auto;
      text-align: center;
    }

    .pm-certificate-title {
      position: relative;
      top: 40px;
      margin: 0 auto;
      left: 0;
      text-align: center;
      h2 {
        font-size: 34px;
      }
    }

    .logo {
      display: block;
      position: relative;
      margin: 0 auto;
      left: 0;
    }

    .pm-certificate-footer {
      width: 650px;
      height: 100px;
      position: relative;
      left: 50%;
      margin-left: -355px;
      bottom: -145px;
    }
  }
}
</style>
