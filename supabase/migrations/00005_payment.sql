ALTER TABLE shops ADD COLUMN IF NOT EXISTS payment_qr TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'confirmed'));
