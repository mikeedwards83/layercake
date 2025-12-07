namespace LayerCake.Kernel.Store
{
    public abstract class QueryParameters(string queryName, int skip, int take)
    {
        public string QueryName { get; } = queryName;
        public int Skip { get; set; }  = skip;
        public int Take { get; set; } = take;   
    }
}
