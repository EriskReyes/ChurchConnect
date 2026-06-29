import mongoose from 'mongoose';

const adminCodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

adminCodeSchema.statics.getOrCreate = async function() {
  let doc = await this.findOne();
  // Si no existe o tiene formato viejo (codeHash sin code), recrear
  if (!doc || !doc.code) {
    await this.deleteMany({});
    const defaultCode = process.env.ADMIN_CODE || 'CHURCH-ADMIN-2024';
    doc = await this.create({ code: defaultCode });
  }
  return doc;
};

adminCodeSchema.statics.setCode = async function(newCode) {
  await this.findOneAndUpdate({}, { code: newCode, updatedAt: new Date() }, { upsert: true });
};

export default mongoose.model('AdminCode', adminCodeSchema);
