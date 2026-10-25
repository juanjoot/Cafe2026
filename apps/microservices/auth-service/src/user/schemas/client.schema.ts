import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'fechaRegistro' } })
export class Client extends Document {
  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop()
  phone!: string;

  @Prop({
    type: {
      calle: { type: String, required: true },
      ciudad: { type: String, required: true },
      estado: { type: String, required: true },
      codigoPostal: { type: String, required: true },
    },
  })
  direccion!: {
    calle: string;
    ciudad: string;
    estado: string;
    codigoPostal: string;
  };

  @Prop({ required: true })
  fechaNacimiento!: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  usuario!: Types.ObjectId;

  @Prop()
  fechaRegistro!: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
