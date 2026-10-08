'use client';
import { useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';
export function ShareButton(){const [label,setLabel]=useState('Sao chép liên kết');return <button className="text-link" onClick={async()=>{try{await navigator.clipboard.writeText(window.location.href);setLabel('Đã sao chép');}catch{setLabel('Hãy sao chép từ thanh địa chỉ');}}}><LinkIcon size={16}/>{label}</button>;}
