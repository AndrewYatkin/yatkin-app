CREATE TABLE contacts (
                          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          name VARCHAR(255) NOT NULL,
                          email VARCHAR(255) UNIQUE NOT NULL,
                          user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
                          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Включение RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
-- политика чтения: любой аутинтифецированный пользователь может читать свои контакты
CREATE POLICY "Users can read their own contacts" ON contacts
FOR SELECT USING (auth.uid() = user_id);
-- политика вставки
CREATE POLICY "Users can insert their own contacts" ON contacts
FOR INSERT WITH CHECK (auth.uid() = user_id);
-- политика для обновления
CREATE POLICY "Users can update their own contacts" ON contacts
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- политика для удаления
CREATE POLICY "Users can delete their own contacts" ON contacts
FOR DELETE USING (auth.uid() = user_id);

--new policies
ALTER TABLE public.industrial_machine ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read industrial_machine" ON public.industrial_machine FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert industrial_machine" ON public.industrial_machine FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update industrial_machine" ON public.industrial_machine FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete industrial_machine" ON public.industrial_machine FOR DELETE USING (auth.uid() = user_id);