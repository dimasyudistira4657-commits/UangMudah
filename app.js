const ADMIN_PIN='061223';
let klikLogo=0;
document.getElementById('logo').onclick=()=>{klikLogo++;if(klikLogo>=3){klikLogo=0;const pin=prompt('Masukkan PIN Admin');if(pin===ADMIN_PIN){dashboardAdmin.classList.remove('hidden');loginNasabah.classList.add('hidden');}else if(pin){alert('PIN salah');}}};
const rupiah=n=>'Rp '+Number(n||0).toLocaleString('id-ID');
async function loginNasabah(){const nama=document.getElementById('nama').value.trim();const {data,error}=await supabase.from('nasabah').select('*').eq('nama_nasabah',nama).single();if(error||!data){alert('Nama tidak ditemukan');return;}loginNasabah.classList.add('hidden');dashboardNasabah.classList.remove('hidden');judulNama.innerText=data.nama_nasabah;vaNasabah.innerText=data.nomor_va;nominalNasabah.innerText=rupiah(data.nominal_tagihan);limitNasabah.innerText=rupiah(data.limit_pinjaman);statusNasabah.innerText=data.status_pembayaran;}
async function simpanNasabah() {
  const nama = document.getElementById("namaBaru").value.trim();
  const va = document.getElementById("vaBaru").value.trim();
  const nominal = document.getElementById("nominalBaru").value;
  const limit = document.getElementById("limitBaru").value;

  if (!nama || !va || !nominal || !limit) {
    alert("Lengkapi semua data.");
    return;
  }

  const { data, error } = await supabase
    .from("nasabah")
    .insert([{
      nama_nasabah: nama,
      nomor_va: va,
      nominal_tagihan: Number(nominal),
      limit_pinjaman: Number(limit),
      status_pembayaran: "Belum Dibayar"
    }]);

  if (error) {
    alert("Gagal menyimpan: " + error.message);
    return;
  }

  alert("Nasabah berhasil disimpan.");
}
async function konfirmasiPembayaran(){await supabase.from('nasabah').update({status_pembayaran:'Menunggu Konfirmasi'}).eq('nama_nasabah',judulNama.innerText);statusNasabah.innerText='Menunggu Konfirmasi';alert('Menunggu konfirmasi admin');}
async function lihatKonfirmasi(){const {data}=await supabase.from('nasabah').select('*').eq('status_pembayaran','Menunggu Konfirmasi');let html='';(data||[]).forEach(n=>{html+=`<div class="card"><b>${n.nama_nasabah}</b><p>${rupiah(n.nominal_tagihan)}</p><button onclick="konfirmasiLunas('${n.nama_nasabah}')">Konfirmasi Lunas</button></div>`});daftarKonfirmasi.innerHTML=html||'<p>Tidak ada konfirmasi.</p>';}
async function konfirmasiLunas(nama){await supabase.from('nasabah').update({status_pembayaran:'Lunas'}).eq('nama_nasabah',nama);lihatKonfirmasi();alert('Status menjadi Lunas');}
