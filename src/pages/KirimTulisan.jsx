"use client";

import { List } from "flowbite-react";

export default function KirimTulisan() {
  return (
    <div className="redaksi min-vh-100 p-10">
      <h1 className="text-3xl font-bold text-center my-7">Kirim Tulisan</h1>
      <div className="w-100 h-1 bg-red-600 mx-auto mt-25 my-7" />
      <p>
        <strong>Resonansi</strong> menerima tulisan/artikel untuk dipublikasikan
        dengan ketentuan sebagai berikut:
      </p>
      <List>
        <List ordered nested>
          <List.Item>
            Membahas isu-isu penting dari ekonomi, sosial, politik, kebudayaan,
            sains, lingkungan hingga kesehatan baik di Indonesia maupun di
            seluruh dunia.
          </List.Item>
          <List.Item>
            Jenis tulisan bisa berupa laporan jurnalistik, polemik, esai
            reflektif, resensi buku, eksposisi teoretis, arsip/dokumen sejarah
            dengan pengantar, dan wawancara.
          </List.Item>
          <List.Item>
            Tulisan wajib merujuk pada fakta dan data dari sumber-sumber rujukan
            yang kredibel. Data dan rujukan harap dikutip menggunakan tautan
            langsung (hyperlink) dan/atau daftar referensi.
          </List.Item>
          <List.Item>
            Ditulis dengan mengikuti kaidah Bahasa Indonesia dengan Pedoman Umum
            Ejaan Bahasa Indonesia (PUEBI).
          </List.Item>
          <List.Item>
            Panjang tulisan berkisar antara 1.500 hingga 2.500 kata. Untuk
            tulisan yang lebih panjang dari 2.500 kata, kami menyarankan untuk
            memecahnya menjadi dua bagian atau lebih.
          </List.Item>
          <List.Item>
            Penulis dapat mencantumkan foto dokumentasi pribadi sebagai
            ilustrasi pelengkap tulisan/artikel. Penulis wajib mencantumkan
            keterangan sumber untuk foto/gambar yang tidak berasal dari penulis.
            Foto/gambar dikirim sebagai berkas terpisah (tidak dimasukkan ke
            dalam berkas tulisan).
          </List.Item>
          <List.Item>
            Left Book Review menerima tinjauan atas buku-buku dalam spektrum
            luas tradisi Marxis. Buku yang diulas disarankan diterbitkan setelah
            tahun 2010.
          </List.Item>
          <List.Item>
            Ditulis dengan mengikuti kaidah Bahasa Indonesia dengan Pedoman Umum
            Ejaan Bahasa Indonesia (PUEBI).
          </List.Item>
          <List.Item>
            Ditulis dengan mengikuti kaidah Bahasa Indonesia dengan Pedoman Umum
            Ejaan Bahasa Indonesia (PUEBI).
          </List.Item>
          <List.Item>
            Ditulis dengan mengikuti kaidah Bahasa Indonesia dengan Pedoman Umum
            Ejaan Bahasa Indonesia (PUEBI).
          </List.Item>
        </List>
      </List>
      <p className="mt-4">
        Redaksi akan mengabarkan penulis maksimal dalam waktu satu minggu
        setelah tulisan dikirim ke Email resonansi2106@gmail.com . Jika lebih dari satu
        minggu redaksi tidak memberikan jawaban, maka tulisan dianggap tidak
        lolos seleksi redaksi dan penulis berhak menerbitkannya di tempat lain.
      </p>
      <p className="mt-4">
        Jika tulisan diterima, penulis wajib mengikuti proses penyuntingan
        bersama editor dengan seksama. Penulis akan segera diberitahu jika
        redaksi menilai tulisan layak untuk langsung diterbitkan. Jika tulisan
        membutuhkan perbaikan mendasar (major revision), atau pembaruan (update)
        data dan fakta sesuai informasi terkini, redaksi akan mengembalikan
        tulisan kepada penulis disertai komentar dan saran-saran perbaikan.
        Penulis memiliki waktu paling lama satu minggu untuk mengirimkan naskah
        yang sudah diperbaiki. Redaksi akan meninjau ulang kelayakan tulisan
        yang telah diperbaiki tersebut dan penulis akan mendapatkan kabarnya
        dalam kurun waktu satu minggu setelah naskah perbaikan dikirimkan.
      </p>
      <p className="mt-4">
        Keberatan atas hasil penyuntingan dari editor dapat diajukan paling
        lambat 1 hari setelah proses editing selesai dilakukan. Penulis dapat
        memilih untuk melanjutkan publikasi di Buletin Resonansi atau tidak.
      </p>
      <p className=" mt-4">
        Penulis bertanggung jawab penuh terhadap tulisan/artikel yang
        dikirimkan. Jika dikemudian hari di dalam tulisan/artikel terbukti
        mengandung unsur plagiarisme, maka redaksi akan menurunkan artikel
        tersebut dan penulis wajib memberikan klarifikasi secara tertulis.
      </p>
      <p className="mt-4">
        Sebuah tulisan/artikel dapat dipublikasikan ulang di Resonansi.
        Keputusan redaksi untuk penerbitan ulang didasarkan pada:
      </p>
      <List>
        <List ordered nested>
          <List.Item>
            Isu/topik yang diangkat di dalam tulisan bersifat penting untuk
            keperluan pendidikan publik.
          </List.Item>
          <List.Item>
            Kontribusi penting bagi pengembangan gerakan sosial dan kajian
            sosial kritis.
          </List.Item>
          <List.Item>
            Artikel telah mengikuti ketentuan penulisan di Resonansi.
          </List.Item>
        </List>
      </List>
    </div>
  );
}
