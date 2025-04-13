import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { IMG_UPLOAD_DIR, PDF_UPLOAD_DIR } from '../common/const/lms.const';
import { promises as fsPromises } from 'fs';

@Injectable()
export class FileUploadService {
  static getPDFStorage() {
    return diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = PDF_UPLOAD_DIR;
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    });
  }

  static getPDFFilter() {
    return (req, file, cb) => {
      if (!file.mimetype.match(/\/pdf$/)) {
        return cb(new Error('Only PDFs are allowed!'), false);
      }
      cb(null, true);
    };
  }

  static getImageStorage() {
    return diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = IMG_UPLOAD_DIR;
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    });
  }

  static getImageFilter() {
    return (req, file, cb) => {
      if (!file.mimetype.match(/image\/*/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    };
  }

  static async delete(filePath: string): Promise<void> {
    try {
      await fsPromises.access(filePath);
      await fsPromises.unlink(filePath);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete file: ${filePath}`);
    }
  }
}
