
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import ImageResize from 'quill-image-resize-module' // 引用
import { ImageDrop } from 'quill-image-drop-module' // 注册
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)
export default {
  name: 'Quil',
  editorOption: {
    theme: 'snow',
    placeholder: '请输入正文',
    modules: {
      imageDrop: true,
      imageResize: {
        displayStyles: {
          backgroundColor: 'black',
          border: 'none',
          color: 'white'
        },
        modules: ['Resize', 'DisplaySize', 'Toolbar']
      },
      //  富文本编辑器配置
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
          ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
          [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
          [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
          [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
          [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
          [{ direction: 'rtl' }], // 文本方向-----[{'direction': 'rtl'}]
          [{ size: ['small', false, 'large', 'huge'] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
          [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
          [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
          [{ font: [] }], // 字体种类-----[{ font: [] }]
          [{ align: [] }], // 对齐方式-----[{ align: [] }]
          ['clean'], // 清除文本格式-----['clean']
          ['image', 'video'] // 链接、图片、视频-----['link', 'image', 'video']
        ]
      }
    }
  }
}
