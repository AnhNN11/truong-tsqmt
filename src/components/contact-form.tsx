'use client';

import { useActionState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { sendContact } from '@/lib/actions';
import styles from './contact-section.module.css';

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, { error: undefined, success: false });

  if (state.success) {
    return <div className={styles.success} role="status">
      <CheckCircle2 size={40} strokeWidth={1.5} aria-hidden="true" />
      <h3>Đã tiếp nhận lời nhắn của bạn</h3>
      <p>Nhà trường đã nhận nội dung lời nhắn và thông tin liên hệ bạn cung cấp.</p>
    </div>;
  }

  return <form action={action} className={styles.form} aria-labelledby="contact-form-title">
    <h3 id="contact-form-title">Gửi lời nhắn</h3>
    <p className={styles.formIntro}>Điền thông tin để nhà trường có thể liên hệ với bạn.</p>
    <div className={styles.fields}>
      <label className={`${styles.field} ${styles.wide}`}>Họ và tên *
        <input className={styles.control} name="name" required minLength={2} maxLength={100} placeholder="Nhập họ và tên" autoComplete="name" />
      </label>
      <label className={styles.field}>Email *
        <input className={styles.control} name="email" type="email" required maxLength={254} placeholder="email@example.com" autoComplete="email" />
      </label>
      <label className={styles.field}><span>Số điện thoại <span className={styles.optional}>(không bắt buộc)</span></span>
        <input className={styles.control} name="phone" type="tel" maxLength={30} placeholder="Số điện thoại liên hệ" autoComplete="tel" />
      </label>
      <label className={`${styles.field} ${styles.wide}`}>Nội dung lời nhắn *
        <textarea className={styles.control} name="message" required minLength={10} maxLength={3000} rows={5} placeholder="Điều bạn muốn trao đổi với nhà trường…" />
      </label>
    </div>
    <input name="website" tabIndex={-1} autoComplete="off" className={styles.honeypot} aria-hidden="true" />
    <label className={styles.consent}>
      <input type="checkbox" required />
      <span>Tôi đồng ý cung cấp thông tin trên để nhà trường liên hệ về yêu cầu này.</span>
    </label>
    {state.error && <p className={styles.error} role="alert">{state.error}</p>}
    <div className={styles.formFooter}>
      <button type="submit" disabled={pending} className={styles.submit}>{pending ? 'Đang gửi…' : 'Gửi lời nhắn'} <ArrowRight size={17} aria-hidden="true" /></button>
    </div>
  </form>;
}
