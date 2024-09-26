import { Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, ParseUUIDPipe, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "../auth/AuthGuard";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiTags } from "@nestjs/swagger";
import { Multer } from 'multer';


@ApiTags("Cloudinary")
@Controller()
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post('/files/uploadImage/:id')
    @UseInterceptors(FileInterceptor('image'))
    @ApiParam({ name: 'id', description: 'ID del recurso al cual asociar la imagen', type: 'string' })
    @ApiConsumes('multipart/form-data') 
    @ApiBody({
      description: 'Archivo de imagen que será subido. Debe ser JPG, PNG, o WEBP y menor a 200KB.',
      required: true,
      schema: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    async uploadImg(
      @Param('id', new ParseUUIDPipe()) id: string,
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({
              maxSize: 200000, // 200KB
              message: 'El archivo debe ser menor a 200KB',
            }),
            new FileTypeValidator({
              fileType: /(jpg|jpeg|png|webp)$/, // Solo imágenes JPG, PNG, o WEBP
            }),
          ],
        }),
      ) file: Express.Multer.File,
    ) {
      return this.cloudinaryService.uploadImage(id, file);
    }
}
