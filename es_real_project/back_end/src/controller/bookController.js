import {
  RequestMethod,
  Controlller,
  RequestMapping,
} from "../utils/decorators";
import data from "../mock/data";

@Controlller("/book")
export default class BookController {
  @RequestMapping(RequestMethod.GET, "/all")
  async getAllBooks(ctx, next) {
    ctx.body = {
      data: data._embedded.episodes
    };
  }

  @RequestMapping(RequestMethod.GET, "/del")
  async deleteBook(ctx, next) {
    ctx.body = [{ name: "JS Learning", price: 1000 }];
  }
}
