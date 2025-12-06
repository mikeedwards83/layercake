namespace LayerCake.Kernel.Store
{
    public abstract class QueryParameters(string name, int skip, int take)
    {
        public string Name { get; } = name;
        public int Skip { get; set; }  = skip;
        public int Take { get; set; } = take;   
    }
}
