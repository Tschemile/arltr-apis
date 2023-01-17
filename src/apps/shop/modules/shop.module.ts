import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from 'apps/address';
import { ProfileModule } from 'apps/profiles';
import { SettingModule } from 'apps/settings';
import { OrderController, ProductController, ReviewController } from '../controllers';
import { Item, Order, Product, Review } from '../entities';
import { ItemService, OrderService, ProductService, ReviewService } from '../services';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Review, Order, Item]),
    forwardRef(() => SettingModule),
    forwardRef(() => AddressModule),
    forwardRef(() => ProfileModule),
  ],
  controllers: [
    ProductController,
    OrderController,
    ReviewController,
  ],
  providers: [
    ProductService,
    OrderService,
    ItemService,
    ReviewService,
  ],
  exports: [
    ProductService,
    OrderService,
    ItemService,
    ReviewService,
  ]
})
export class ShopModule {}
