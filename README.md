## 🎯 Mục tiêu hệ thống:

Một thư viện số giúp người dùng **tìm kiếm, đọc, đánh giá, tải, bình luận, yêu thích và đăng tài liệu**, tích hợp AI như:

-   Tóm tắt nội dung tài liệu
-   Chuyển văn bản thành giọng nói
-   Chatbot hỏi/đáp theo nội dung tài liệu

---

## 📊 Thiết kế cơ sở dữ liệu

### 1. `users` – Quản lý tài khoản người dùng

| Cột          | Kiểu dữ liệu   | Ghi chú                        |
| ------------ | -------------- | ------------------------------ |
| `id`         | UUID / INT PK  | Khóa chính                     |
| `name`       | VARCHAR        | Họ tên                         |
| `email`      | VARCHAR UNIQUE | Email dùng để đăng nhập        |
| `password`   | VARCHAR        | Mật khẩu đã mã hóa             |
| `status`     | ENUM           | `active`, `inactive`, `banned` |
| `created_at` | DATETIME       | Ngày tạo                       |
| `updated_at` | DATETIME       | Ngày cập nhật                  |

📌 _Ý nghĩa:_ Phân biệt rõ người dùng và quản trị viên. Trạng thái hỗ trợ "ngừng hoạt động" mà không mất dữ liệu.

---

### 2. `categories` – Danh mục tài liệu

| Cột           | Kiểu dữ liệu | Ghi chú              |
| ------------- | ------------ | -------------------- |
| `id`          | INT PK       | Khóa chính           |
| `name`        | VARCHAR      | Tên danh mục         |
| `description` | TEXT         | Mô tả                |
| `status`      | ENUM         | `active`, `inactive` |

📌 _Ý nghĩa:_ Dùng để phân loại các tài liệu.

---

### 5. `documents` – Tài liệu/sách

| Cột              | Kiểu dữ liệu  | Ghi chú                           |
| ---------------- | ------------- | --------------------------------- |
| `id`             | UUID / INT PK | Khóa chính                        |
| `title`          | VARCHAR       | Tên tài liệu                      |
| `description`    | TEXT          | Mô tả ngắn                        |
| `category_id`    | INT FK        | Tham chiếu `categories`           |
| `author_id`      | INT FK        | Tham chiếu `users`                |
| `file_path`      | VARCHAR       | Đường dẫn tệp gốc                 |
| `pdf_path`       | VARCHAR       | Đường dẫn file PDF                |
| `status`         | ENUM          | `pending`, `approved`, `rejected` |
| `uploaded_by_id` | UUID FK       | Người tải lên                     |
| `created_at`     | DATETIME      | Ngày tải lên                      |

📌 _Ý nghĩa:_ Gắn với danh mục, nhà xuất bản và tác giả.

---

### 6. `comments` – Bình luận tài liệu

| Cột           | Kiểu dữ liệu | Ghi chú             |
| ------------- | ------------ | ------------------- |
| `id`          | INT PK       | Khóa chính          |
| `document_id` | INT FK       | Tài liệu            |
| `user_id`     | INT FK       | Người bình luận     |
| `content`     | TEXT         | Nội dung bình luận  |
| `created_at`  | DATETIME     | Thời gian bình luận |

---

### 7. `ratings` – Đánh giá

| Cột           | Kiểu dữ liệu  | Ghi chú            |
| ------------- | ------------- | ------------------ |
| `id`          | INT PK        | Khóa chính         |
| `document_id` | INT FK        | Tài liệu           |
| `user_id`     | INT FK        | Người đánh giá     |
| `score`       | INT           | Từ 1 đến 5         |
| `comment`     | TEXT NULLABLE | Ghi chú thêm       |
| `created_at`  | DATETIME      | Thời gian đánh giá |

---

### 8. `favorites` – Yêu thích

| Cột           | Kiểu dữ liệu | Ghi chú           |
| ------------- | ------------ | ----------------- |
| `user_id`     | INT FK       | Người dùng        |
| `document_id` | INT FK       | Tài liệu          |
| `created_at`  | DATETIME     | Khi được đánh dấu |

📌 _Ý nghĩa:_ Người dùng có thể đánh dấu tài liệu yêu thích.

---

### 9. `downloads` – Lượt tải xuống

| Cột           | Kiểu dữ liệu | Ghi chú       |
| ------------- | ------------ | ------------- |
| `id`          | INT PK       | Khóa chính    |
| `user_id`     | INT FK       | Ai tải        |
| `document_id` | INT FK       | Tài liệu nào  |
| `created_at`  | DATETIME     | Thời điểm tải |

---

### 10. `system_configs` – Cấu hình hệ thống

| Cột           | Kiểu dữ liệu | Ghi chú        |
| ------------- | ------------ | -------------- |
| `key`         | VARCHAR PK   | Khóa cấu hình  |
| `value`       | TEXT         | Giá trị        |
| `description` | TEXT         | Mô tả cấu hình |

📌 _VD:_ `max_login_attempts`, `homepage_doc_limit`.

---

### 12. `ai_summaries` – Dữ liệu tóm tắt AI

| Cột           | Kiểu dữ liệu | Ghi chú          |
| ------------- | ------------ | ---------------- |
| `id`          | INT PK       | Khóa chính       |
| `document_id` | INT FK       | Gắn với tài liệu |
| `summary`     | TEXT         | Nội dung tóm tắt |
| `created_at`  | DATETIME     | Khi tóm tắt xong |

---

### 13. `ai_voices` – Chuyển văn bản thành giọng nói

| Cột           | Kiểu dữ liệu | Ghi chú          |
| ------------- | ------------ | ---------------- |
| `id`          | INT PK       | Khóa chính       |
| `document_id` | INT FK       | Gắn với tài liệu |
| `audio_path`  | VARCHAR      | File âm thanh    |
| `created_at`  | DATETIME     | Khi tạo âm thanh |

---

### 14. `chatbot_questions` – Lưu lịch sử hỏi đáp AI

| Cột           | Kiểu dữ liệu | Ghi chú              |
| ------------- | ------------ | -------------------- |
| `id`          | INT PK       | Khóa chính           |
| `user_id`     | INT FK       | Ai hỏi               |
| `document_id` | INT FK       | Gắn với tài liệu nào |
| `created_at`  | DATETIME     | Thời điểm hỏi        |

---

## 🔗 Quan hệ giữa các bảng

-   `users` 1-N `documents` (người tải tài liệu)
-   `documents` 1-N `comments`, `ratings`, `downloads`, `favorites`
-   `categories`, `publishers`, `authors` 1-N `documents`
-   `documents` 1-1 `ai_summaries`, `ai_voices`
-   `users` 1-N `chatbot_questions`, `favorites`, `downloads`

---
