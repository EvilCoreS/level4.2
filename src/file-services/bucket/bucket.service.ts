import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class BucketService {
  private readonly client: S3Client;
  private readonly bucketName: string;
  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get('aws.name');
    this.client = new S3Client({
      region: this.configService.get('aws.region'),
      credentials: {
        accessKeyId: this.configService.get('aws.access_key'),
        secretAccessKey: this.configService.get('aws.secret_key'),
      },
    });
  }

  async addFile(name: string, buffer: Buffer, mimetype: string) {
    const params = {
      Bucket: this.bucketName,
      Key: name,
      Body: buffer,
      ContentType: mimetype,
    };

    const putObjectCommand = new PutObjectCommand(params);
    this.client.send(putObjectCommand).then((data) => {
      console.log('Uploaded to Bucket');
    });

    const getObjectCommand = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: name,
    });

    return getSignedUrl(this.client, getObjectCommand, {
      expiresIn: 604800,
    });
  }

  async deleteFile(name: string) {
    const params = {
      Bucket: this.bucketName,
      Key: name,
    };

    const deleteObjectCommand = new DeleteObjectCommand(params);

    this.client.send(deleteObjectCommand).then(() => {
      console.log('Deleted');
    });
  }
}
