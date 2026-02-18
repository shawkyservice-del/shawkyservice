"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AlertTriangle, AlertCircle, XCircle, Search, FileText, Clock, Shield, Users, Hammer, Package, CheckCircle, TrendingUp, Zap, Eye } from "lucide-react"
import { useState } from "react"

const penalties = [
  {
    category: "الحضور والتقارير اليومية",
    severity: "low",
    icon: Clock,
    gradient: "from-blue-500 to-cyan-500",
    items: [
      { id: 1, violation: "عدم إرسال فيديو الحضور من الموقع مع شرح الأعمال", penalty: "50", notes: "" },
      { id: 2, violation: "فبركة اللوكيشن أو فيديو الموقع", penalty: "150", notes: "" },
      { id: 3, violation: "التأخير في نزول الموقع الجديد للبدء", penalty: "200", notes: "عن كل يوم" },
      { id: 8, violation: "عدم إرسال التقرير اليومي لخدمة العملاء بحد أقصى الساعة 11", penalty: "50", notes: "" },
      { id: 9, violation: "عدم توضيح الأعطال في التقرير", penalty: "100", notes: "عن كل يوم" },
      { id: 63, violation: "انصراف المهندس قبل مواعيد العمل علماً بوجود أعمال في الموقع", penalty: "خصم اليوم", notes: "" },
      { id: 64, violation: "عمل خاصية في الموبايل أو قفله بقصد من المهندس لعدم الوصول له", penalty: "100", notes: "" },
      { id: 66, violation: "غلق المهندس الموبايل أثناء الإجازة مما يعوق العمل", penalty: "100", notes: "" },
      { id: 67, violation: "التأكد من تعطيل المهندس للبنود لأخذ إجازة", penalty: "300", notes: "" },
    ],
  },
  {
    category: "المعاينات والتوريدات",
    severity: "medium",
    icon: Package,
    gradient: "from-purple-500 to-pink-500",
    items: [
      { id: 4, violation: "عدم مقارنة بلان المعاينة بالموقع", penalty: "500", notes: "" },
      { id: 5, violation: "عدم وضع شيرب الموقع لجميع المقاولين في جميع الفراغات", penalty: "150", notes: "" },
      { id: 17, violation: "عدم رجوع المرتجعات المتبقية", penalty: "150", notes: "" },
      { id: 18, violation: "عدم طلب التوريدات الناقصة للموقع وتعطيل الصنايعي", penalty: "خصم يومية الصنايعي", notes: "" },
      { id: 22, violation: "عدم التنسيق بين طلب المقاولين وطلب التوريد من الجهة المختصة", penalty: "150", notes: "" },
      { id: 31, violation: "عدم استلام المهندس للخامات وتوقيعه على إذن الاستلام", penalty: "150", notes: "في حالة سرقة البضاعة يتم خصمها على المهندس" },
      { id: 35, violation: "عدم إرسال نواقص السيراميك في بداية الأعمال", penalty: "200", notes: "" },
      { id: 36, violation: "عدم طلب المعابر الرخام في بداية المرحلة", penalty: "150", notes: "" },
      { id: 60, violation: "عدم استلام السيراميك أو الصحي الاستلام الجيد من المورد", penalty: "تحمل الخسائر", notes: "" },
    ],
  },
  {
    category: "الإضافات والمستخلصات",
    severity: "medium",
    icon: FileText,
    gradient: "from-amber-500 to-orange-500",
    items: [
      { id: 6, violation: "التأخير في إرسال الإضافات الموجودة في الموقع", penalty: "100", notes: "عن كل يوم" },
      { id: 7, violation: "تنفيذ الإضافة بدون الرجوع للحسابات", penalty: "قيمة الإضافة", notes: "" },
      { id: 28, violation: "تأخير مستخلص المقاول", penalty: "50", notes: "عن كل يوم" },
      { id: 29, violation: "عدم إرسال صور المستخلص واضحة", penalty: "50", notes: "" },
      { id: 30, violation: "عدم ملء جميع بيانات المستخلص", penalty: "50", notes: "" },
      { id: 33, violation: "التأخير في تصفية العهدة", penalty: "وقف الراتب", notes: "" },
      { id: 41, violation: "خروج مستخلص بدون استلام", penalty: "300", notes: "" },
      { id: 42, violation: "وجود أخطاء بعد خروج المستخلص", penalty: "التكلفة بالتساوي", notes: "على مهندس الموقع - مدير المنطقة - الجودة" },
    ],
  },
  {
    category: "المراحل والجدول الزمني",
    severity: "high",
    icon: CheckCircle,
    gradient: "from-green-500 to-emerald-500",
    items: [
      { id: 10, violation: "عدم إرسال فيديو خدمة العملاء قبل انتهاء المرحلة بـ4 أيام للمطالبة بالدفعة", penalty: "100", notes: "عن كل يوم" },
      { id: 11, violation: "نظافة الموقع بعد المرحلة", penalty: "100", notes: "عن كل يوم" },
      { id: 12, violation: "عدم إرسال فيديو المرحلة / ترحيل الجدول الزمني", penalty: "100", notes: "عن كل يوم" },
      { id: 21, violation: "التأخير في الجدول الزمني بسبب إهمال أو تأخير من المهندس", penalty: "50", notes: "عن كل يوم" },
      { id: 72, violation: "عدم إبلاغ قسم التصوير لتصوير المرحلة", penalty: "300", notes: "" },
      { id: 73, violation: "تبليغ قسم التصوير بتصوير الموقع وعدم تجهيز الموقع", penalty: "300", notes: "" },
    ],
  },
  {
    category: "الجودة والاستلام",
    severity: "high",
    icon: Shield,
    gradient: "from-indigo-500 to-purple-500",
    items: [
      { id: 13, violation: "عدم استلام المهندس البنود والاعتماد على الجودة", penalty: "200", notes: "" },
      { id: 14, violation: "عدم إرسال فيديو للجودة بالاستلام", penalty: "100", notes: "عن كل يوم" },
      { id: 15, violation: "عدم استلام مدير المنطقة للأعمال", penalty: "200", notes: "" },
      { id: 16, violation: "عدم عمل ملاحظات الجودة في أكثر من 48 ساعة", penalty: "50", notes: "عن كل يوم" },
      { id: 23, violation: "عدم تنفيذ الأعمال وفقاً لأصول الصناعة", penalty: "قيمة الخسائر", notes: "" },
      { id: 52, violation: "عدم الالتزام بمواصفات الأعمال المرسلة من الشركة", penalty: "قيمة الخسائر", notes: "" },
      { id: 76, violation: "عدم استلام البنود طبقاً للمعايير الصحيحة", penalty: "200", notes: "" },
    ],
  },
  {
    category: "الخامات والتشوينات",
    severity: "high",
    icon: Package,
    gradient: "from-teal-500 to-cyan-500",
    items: [
      { id: 19, violation: "تهدير الخامات الموجودة في الموقع", penalty: "خصم التكلفة", notes: "" },
      { id: 32, violation: "التهدير في خامات التشوين", penalty: "300", notes: "" },
      { id: 34, violation: "عدم إرسال صور موضحة للتشوينات", penalty: "100", notes: "" },
      { id: 37, violation: "عدم تغليف الأبواب", penalty: "200", notes: "" },
      { id: 38, violation: "عدم تغليف الصحي", penalty: "200", notes: "" },
      { id: 39, violation: "عدم فرش كرتون على السيراميك", penalty: "500", notes: "" },
      { id: 40, violation: "عدم الحفاظ على الألوميتال بعد التركيب", penalty: "300", notes: "" },
      { id: 61, violation: "عدم تشوين الخامات بطريقة جيدة", penalty: "تحمل الخسائر", notes: "إن وجدت" },
      { id: 75, violation: "تشوين الإسمنت في الشتاء خارج الوحدة", penalty: "تحمل الخسائر + 5000", notes: "" },
    ],
  },
  {
    category: "التعامل مع العملاء",
    severity: "critical",
    icon: Users,
    gradient: "from-red-500 to-rose-500",
    items: [
      { id: 24, violation: "الإهمال في الألوميتال بالمواقع", penalty: "تكلفة الصيانة", notes: "" },
      { id: 25, violation: "عمل مشكلة أو تشويه سمعة الشركة في الكومباوند أو الموقع", penalty: "1000", notes: "" },
      { id: 26, violation: "تبليغ العميل بأعطال الشركة", penalty: "350", notes: "" },
      { id: 27, violation: "التحدث مع العملاء وإعطاء العملاء أرقام التليفون", penalty: "فصل", notes: "" },
      { id: 58, violation: "الاتفاق مع العميل على عمل أي بند خارج الشركة", penalty: "إنذار بالفصل", notes: "مع عدم الحصول على أي مستحقات" },
      { id: 59, violation: "تسليم العميل مفتاح الوحدة دون الرجوع للإدارة", penalty: "1000", notes: "" },
    ],
  },
  {
    category: "التعامل مع المقاولين",
    severity: "medium",
    icon: Hammer,
    gradient: "from-yellow-500 to-amber-500",
    items: [
      { id: 45, violation: "التحدث مع المقاولين على مشاكل الشركة", penalty: "300", notes: "" },
      { id: 46, violation: "التحدث مع المقاولين في الأمور المادية للمقاول", penalty: "300", notes: "" },
      { id: 50, violation: "الاتفاق مع المقاولين على يوميات بدون الرجوع مع الجهة المختصة", penalty: "تحمل باقي اليوميات", notes: "" },
      { id: 51, violation: "التحدث مع المقاولين بطريقة غير لائقة", penalty: "100", notes: "" },
      { id: 68, violation: "التوصيف الخاطئ للمقاول مما يؤدي إلى وجود مشكلة في البند", penalty: "تحمل التكلفة", notes: "" },
      { id: 69, violation: "عدم توصيف الشغل للمقاول بفيديو والاكتفاء بإرسال البلان للمقاول", penalty: "تحمل التكلفة", notes: "" },
    ],
  },
  {
    category: "المظهر والالتزام المهني",
    severity: "low",
    icon: Eye,
    gradient: "from-sky-500 to-blue-500",
    items: [
      { id: 43, violation: "عدم ارتداء الـ Vest في الموقع", penalty: "100", notes: "يتم التوضيح في فيديو الحضور والانصراف" },
      { id: 44, violation: "عدم الاهتمام بالمظهر الشخصي في الموقع", penalty: "100", notes: "" },
      { id: 48, violation: "عدم زيارة المهندس للشركة على الأقل يوم كل أسبوعين", penalty: "200", notes: "" },
      { id: 49, violation: "عدم ارتداء المهندس الـ Vest في الشركة", penalty: "100", notes: "" },
    ],
  },
  {
    category: "السلامة والأمان",
    severity: "critical",
    icon: AlertTriangle,
    gradient: "from-orange-500 to-red-500",
    items: [
      { id: 20, violation: "الإهمال في الموقع مما يؤدي إلى كارثة", penalty: "خصم التكلفة", notes: "" },
      { id: 47, violation: "عدم تسليم المهندس للشركة مفاتيح الأبواب التي تم تركيبها في أقرب زيارة", penalty: "300", notes: "مع تغيير قلب الباب على حساب المهندس" },
      { id: 62, violation: "وجود أي تلفيات في الموقع من المهندس", penalty: "تحمل المسؤول", notes: "" },
      { id: 70, violation: "عدم غلق المياه والكهرباء يومياً من مهندس الموقع", penalty: "تحمل كافة الخسائر + 200", notes: "إن وجدت" },
      { id: 74, violation: "وجود أي رطوبة في الموقع", penalty: "500", notes: "" },
    ],
  },
  {
    category: "الكومباوند والاشتراطات الخارجية",
    severity: "high",
    icon: Shield,
    gradient: "from-violet-500 to-purple-500",
    items: [
      { id: 53, violation: "عدم رجوع المهندس لاشتراطات الكومباوند", penalty: "تحمل التكلفة أو الغرامة", notes: "" },
      { id: 54, violation: "حضور أي جهة إلى الموقع وعدم توجه المهندس على الرغم من إبلاغه", penalty: "500", notes: "" },
      { id: 55, violation: "عدم الالتزام بمواعيد الكومباوند مما يؤدي لوقوع غرامات على الشركة", penalty: "قيمة الغرامة", notes: "" },
      { id: 56, violation: "التكسير في الساسات المنشأة (أعمدة)", penalty: "الغرامة + 500", notes: "" },
      { id: 65, violation: "حضور أي جهة إلى الموقع وعدم توجه المهندس على الرغم من إبلاغه", penalty: "200", notes: "" },
    ],
  },
  {
    category: "التخطيط والمكتب الفني",
    severity: "medium",
    icon: FileText,
    gradient: "from-lime-500 to-green-500",
    items: [
      { id: 57, violation: "عمل تعديلات في الموقع بدون الرجوع للإدارة", penalty: "تحمل قيمة التعديل", notes: "" },
      { id: 71, violation: "عدم مراجعة وفهم البلانات مع مهندس المكتب الفني من المهندس", penalty: "200", notes: "" },
    ],
  },
]

export function PenaltiesTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredPenalties = penalties.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.violation.includes(searchTerm) || 
      item.penalty.includes(searchTerm) ||
      item.notes.includes(searchTerm)
    )
  })).filter(category => 
    category.items.length > 0 && 
    (!selectedCategory || category.category === selectedCategory)
  )

  const totalPenalties = penalties.reduce((sum, cat) => sum + cat.items.length, 0)
  const criticalCount = penalties.filter(c => c.severity === 'critical').reduce((sum, cat) => sum + cat.items.length, 0)
  const highCount = penalties.filter(c => c.severity === 'high').reduce((sum, cat) => sum + cat.items.length, 0)

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-block">
            <div className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              <h1 className="text-4xl font-black mb-2">لائحة الاشتراطات والجزاءات</h1>
              <p className="text-lg opacity-90">دليل شامل للمعايير والالتزامات المهنية</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all"></div>
            <div className="relative p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <p className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">{totalPenalties}</p>
              <p className="text-sm font-semibold text-muted-foreground">إجمالي البنود</p>
            </div>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all"></div>
            <div className="relative p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">{penalties.length}</p>
              <p className="text-sm font-semibold text-muted-foreground">الأقسام</p>
            </div>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 group-hover:from-orange-500/30 group-hover:to-red-500/30 transition-all"></div>
            <div className="relative p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <p className="text-5xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">{highCount}</p>
              <p className="text-sm font-semibold text-muted-foreground">مخالفات جسيمة</p>
            </div>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-rose-500/20 group-hover:from-red-500/30 group-hover:to-rose-500/30 transition-all"></div>
            <div className="relative p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                <XCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-5xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-2">{criticalCount}</p>
              <p className="text-sm font-semibold text-muted-foreground">مخالفات حرجة</p>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="bg-gradient-to-r from-card to-secondary/30 border-2 border-primary/20 shadow-xl">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary w-6 h-6" />
              <Input
                type="text"
                placeholder="ابحث في لائحة الاشتراطات... (مثال: فيديو، مستخلص، جودة)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-14 h-14 text-lg border-2 border-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>
        </Card>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
              !selectedCategory 
                ? 'bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg' 
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            الكل ({totalPenalties})
          </button>
          {penalties.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === cat.category
                  ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg`
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              {cat.category} ({cat.items.length})
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {filteredPenalties.map((category, idx) => {
            const CategoryIcon = category.icon

            return (
              <Card 
                key={category.category} 
                className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 transform hover:shadow-2xl group"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
                }}
              >
                {/* Category Header with Gradient */}
                <div className={`relative p-6 bg-gradient-to-r ${category.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-4 right-4 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-4 left-4 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
                  </div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <CategoryIcon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white mb-1 drop-shadow-lg">{category.category}</h3>
                        <p className="text-white/90 font-semibold">{category.items.length} بند</p>
                      </div>
                    </div>
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 text-sm font-bold shadow-lg">
                      {category.severity === 'critical' ? '🔴 حرجة' : 
                       category.severity === 'high' ? '🟠 جسيمة' : 
                       category.severity === 'medium' ? '🟡 متوسطة' : '🔵 تحذيرية'}
                    </Badge>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-secondary/50 to-secondary/30 border-b-2 border-primary/20">
                        <th className="text-right p-4 text-sm font-black text-foreground w-16">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            م
                          </div>
                        </th>
                        <th className="text-right p-4 text-sm font-black text-foreground">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-primary" />
                            المخالفة
                          </div>
                        </th>
                        <th className="text-right p-4 text-sm font-black text-foreground w-48">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            الجزاء (جنيه)
                          </div>
                        </th>
                        <th className="text-right p-4 text-sm font-black text-foreground w-64">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary" />
                            ملاحظات
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((item, itemIdx) => (
                        <tr 
                          key={item.id} 
                          className="border-b border-border/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 group/row"
                          style={{
                            animation: `fadeIn 0.4s ease-out ${itemIdx * 0.05}s both`
                          }}
                        >
                          <td className="p-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-black text-primary group-hover/row:scale-110 transition-transform">
                              {item.id}
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-foreground font-medium leading-relaxed group-hover/row:text-primary transition-colors">
                              {item.violation}
                            </p>
                          </td>
                          <td className="p-4">
                            <Badge 
                              className={`px-4 py-2 text-sm font-bold shadow-md group-hover/row:scale-105 transition-transform ${
                                item.penalty.includes('فصل') 
                                  ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-0' :
                                item.penalty.includes('تكلفة') || item.penalty.includes('خسائر') || item.penalty.includes('تحمل')
                                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0' :
                                item.penalty.includes('وقف')
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0' :
                                  'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0'
                              }`}
                            >
                              {item.penalty}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {item.notes || '—'}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Category Footer */}
                <div className={`p-4 bg-gradient-to-r ${category.gradient} bg-opacity-5 border-t-2 border-primary/10`}>
                  <p className="text-center text-sm font-semibold text-muted-foreground">
                    إجمالي {category.items.length} بند في قسم {category.category}
                  </p>
                </div>
              </Card>
            )
          })}
        </div>

        {/* No Results */}
        {filteredPenalties.length === 0 && (
          <Card className="bg-gradient-to-br from-secondary/50 to-card border-2 border-dashed border-primary/30 p-16">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">لا توجد نتائج</h3>
              <p className="text-muted-foreground">
                لم يتم العثور على نتائج للبحث "{searchTerm}"
              </p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory(null)
                }}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-primary to-purple-500 text-white rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105"
              >
                إعادة تعيين البحث
              </button>
            </div>
          </Card>
        )}

        {/* Footer Note */}
        <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/20">
          <div className="p-6 text-center">
            <p className="text-sm font-semibold text-muted-foreground">
              💡 هذه اللائحة تهدف إلى تحسين جودة العمل والالتزام المهني لضمان أفضل خدمة للعملاء
            </p>
          </div>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  )
}
