export interface Message {
  message_media_url:  string | null;
  id:                 number;
  topic_message_id:   number;
  user_id:            number;
  shop_id:            number | null;
  reply_message_id:   null;
  content:            string;
  type_message_media: null;
  is_read:            number;
  is_active:          number;
  create_at:          string;
  update_at:          string;
  delete_at:          null;
}
